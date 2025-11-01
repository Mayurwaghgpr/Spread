import Post from "../models/posts/posts.model.js";
import { Op, Sequelize } from "sequelize";
import User from "../models/user.model.js";
import { deletePostImage } from "../utils/deleteImages.js";
import PostBlock from "../models/posts/postBlock.model.js";
import Likes from "../models/likes.model.js";
import Comments from "../models/comments.model.js";
import cloudinary from "../config/cloudinary.js";
import redisClient from "../utils/redisClient.js";
import Follow from "../models/follow.model.js";
import postService from "../services/post.service.js";
import cloudinaryService from "../services/cloudinary.service.js";
import db from "../config/database.js";
import SavedPost from "../models/savedPost.model.js";

export const AddNewPost = async (req, res, next) => {
  const imageFileArray = req.files || [];
  const uploadedPublicIds = [];
  // Validate incoming request
  if (!req.body.blog || !req.body.Topic) {
    return res.status(400).json({ error: "Blog data or topic is missing" });
  }
  let PostBlock;
  try {
    PostBlock = JSON.parse(req.body.blog);
  } catch {
    return res.status(400).json({ error: "Invalid blog JSON format" });
  }
  const topic = req.body.Topic.toLowerCase();
  const postTitle = PostBlock.find((p) => p.index === 0)?.data;
  const subtitle = PostBlock.at(1)?.data;

  if (!postTitle || !subtitle) {
    return res
      .status(400)
      .json({ error: "Invalid title or subtitle data provided" });
  }
  // Handle title image
  const previewImage = imageFileArray.at(0);
  if (!previewImage) {
    return res.status(400).json({ error: "Preview image is required" });
  }

  const transaction = await db.transaction();
  try {
    if (!previewImage) {
      return res.status(400).json({ error: "Preview image is required" });
    }
    const previewUpload = await cloudinary.uploader.upload(previewImage?.path);
    uploadedPublicIds.push(previewUpload.public_id);
    // Create a new post
    const newPost = await Post.create(
      {
        title: postTitle,
        subtitle,
        previewImage: previewUpload.secure_url,
        cloudinaryPubId: previewUpload.public_id,
        topic,
        authorId: req.authUser.id,
      },
      { transaction }
    );

    // Map additional images
    const imageMap = new Map();

    // Filter additional images, skipping the first one, which is the title image
    const imageFiles = imageFileArray.slice(1);

    const uploadResults = await Promise.allSettled(
      imageFiles.map(async (img) => {
        const key = Number(img?.fieldname.split("-")[1]);
        if (!isNaN(key)) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            img.path
          );
          uploadedPublicIds.push(public_id);
          return { index: key, imageUrl: secure_url, public_id };
        }
      })
    );

    for (const r of uploadResults) {
      if (r.status === "fulfilled" && r.value) {
        imageMap.set(r.value.index, r.value);
      }
    }
    // Arrange post content
    const postData = PostBlock.filter((p) => p.index > 1) // Skip title and subtitle
      .map((p) => ({
        type: p.type,
        content: p.type === "image" ? imageMap.get(p.index)?.imageUrl : p.data,
        otherInfo: p.type === "image" ? p.data : "",
        cloudinaryPubId:
          p.type === "image" ? imageMap.get(p.index)?.public_id : "",
        index: p.index,
        postId: newPost.id,
      }))
      .filter((p) => p.content); // Exclude items without content

    // Bulk insert all post content in one go
    if (postData.length) {
      await PostBlock.bulkCreate(postData, { transaction });
    }

    // Delete temp uploaded images
    await deletePostImage(imageFileArray);

    // Save Post & postBlocks data by commiting transaction
    await transaction.commit();

    // Send success response
    return res
      .status(201)
      .json({ newPost, message: "Post created successfully" });
  } catch (error) {
    // Rollbacks post & postBlocks saved data transaction on error occurs
    await transaction.rollback();
    //
    await deletePostImage(imageFileArray);
    await cloudinaryService.deleteImages(uploadedPublicIds);
    console.error("Error adding new post:", error);
    next(error);
  }
};

export const getPostPreview = async (req, res, next) => {
  const type = req.query.type?.toLowerCase().trim() || "all";
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const cacheKey = `post_preview_${lastTimestamp}_${type}_${limit}`;
  try {
    const posts = await postService.getPaginatedPosts({
      lastTimestamp,
      limit,
      cacheKey,
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    next(error); // Pass the error to the error handling middleware
  }
};

export const getPostPreviewByUserFollowings = async (req, res, next) => {
  const type = req.query.type?.toLowerCase().trim() || "all";
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const currentUserId = req.authUser.id;

  const postsCacheKey = `post_preview_by_followings:${currentUserId}:${type}:${limit}:${lastTimestamp}`;
  let followedIds = "";
  try {
    // Try to fetch from Redis cache
    const cachedPosts = await redisClient.get(postsCacheKey);
    if (cachedPosts) {
      console.log("cache hit");
      return res.status(200).json(JSON.parse(cachedPosts));
    }
    console.log("cache miss");
    const followCacheKey = `user_followings:${currentUserId}`;
    const followedCached = await redisClient.get(followCacheKey);

    if (followedCached) {
      followedIds = JSON.parse(followedCached);
    } else {
      //  Get followed user IDs
      const followedUsers = await Follow.findAll({
        where: { followerId: currentUserId },
        attributes: ["followedId"],
        raw: true,
      });

      followedIds = followedUsers.map((f) => f.followedId);
      await redisClient.setEx(followCacheKey, 300, JSON.stringify(followedIds));
    }

    if (!followedIds.length) {
      return res.status(200).json([]);
    }

    //  Fetch posts from followed users
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "subtitle",
        "topic",
        "cloudinaryPubId",
        "publicationId",
        "previewImage",
        "publishedAt",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "userImage", "displayName"],
        },
        {
          model: Likes,
          as: "Likes",
          attributes: ["id", "type", "likedBy", "createdAt", "updatedAt"],
        },
        {
          model: Comments,
          as: "comments",
          attributes: ["id", "userId", "topCommentId", "replyTo"],
        },
      ],
      where: {
        authorId: { [Op.in]: followedIds },
        createdAt: { [Op.lt]: lastTimestamp },
      },
      order: [["createdAt", "DESC"]],
      limit,
    });

    //  Cache the result for 5 minutes
    await redisClient.setEx(postsCacheKey, 300, JSON.stringify(posts));
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts from followed users:", error);
    next(error);
  }
};

// Fetch a post by its ID along with associated content and images
export const getPostView = async (req, res, next) => {
  const id = req.params.id;

  try {
    const post = await postService.findPostById({ id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    next(error);
  }
};

export const addSavedPostToGroup = async (req, res, next) => {
  const { postId, groupName, userId } = req.body;
  // const userId = req.authUser.id;

  try {
    const exist = await SavedPost.findOne({ where: { postId, userId } });
    if (!exist) {
      return res.status(400).json({ message: " Not found any saved post" });
    }
    exist.update({ groupName });
    await exist.save();
    res.status(200).json({
      SavedPost: exist,
    });
  } catch (error) {
    console.error("Error grouping saved post:", error);
    next(error);
  }
};

export const getSavedPostsGroups = async (req, res, next) => {
  const userId = req.authUser.id;

  try {
    const groups = await SavedPost.findAll({
      where: { userId, groupName: { [Op.ne]: null } },
      attributes: [
        "groupName",
        [Sequelize.fn("COUNT", Sequelize.col("SavedPost.id")), "postCount"],
      ],
      group: ["SavedPost.groupName"],
      order: [["groupName", "ASC"]],
    });

    res.status(200).json({
      message: "Fetched grouped saved posts successfully",
      groups,
    });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    next(error);
  }
};
export const getSavedPost = async (req, res, next) => {
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const group = req.query.group !== "all" ? { groupName: req.query.group } : {};
  try {
    const savedPosts = await SavedPost.findAll({
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
        userId,
        ...group,
      },
      attributes: ["createdAt"],
      include: [
        {
          model: Post,
          as: "post",
          required: true,

          include: [
            { model: User, attributes: ["id", "username", "userImage"] },
            {
              model: Likes,
              as: "Likes",
              attributes: ["id", "type", "likedBy", "createdAt", "updatedAt"],
            },
            {
              model: Comments,
              as: "comments",
              attributes: ["id", "userId", "topCommentId", "replyTo"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const posts = savedPosts.map((SavedPost) => SavedPost.post);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    next(error);
  }
};

// Edit an existing post by its ID
export const EditPost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Update post fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.author = req.body.author || post.author;
    post.date = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error editing post:", error);
    next(error);
  }
};

/// Delete a post by its ID and associated images
export const DeletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.authUser.id;

    // Fetch post along with images & comments
    const post = await Post.findOne({
      where: { id: postId, authorId: userId },
      include: [
        {
          model: PostBlock,
          as: "PostBlock",
          where: { type: "image" },
          attributes: ["cloudinaryPubId"],
          required: false,
        },
        {
          model: Comments,
          as: "comments", // Include associated comments
          attributes: ["id"],
          required: false,
        },
      ],
      nest: true,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or you are not an author" });
    }

    // Extract Cloudinary image IDs title image and content images
    const uploadedPublicIds = [
      post.cloudinaryPubId,
      ...post.PostBlock.flatMap(({ cloudinaryPubId }) => cloudinaryPubId || []),
    ].filter(Boolean);
    // Delete images in parallel if there are any
    await cloudinaryService.deleteImages(uploadedPublicIds);
    // Delete comments & post in parallel
    await Promise.all([
      Comments.destroy({ where: { postId } }),
      post.destroy(),
    ]);

    await redisClient.del(postId);

    return res
      .status(200)
      .json({ id: postId, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    next(error);
  }
};
