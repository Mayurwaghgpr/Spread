import Post from "../models/posts.js";
import{Op } from "sequelize";
import User from "../models/user.js";
import { deletePostImage } from "../utils/deleteImages.js";
import PostContent from "../models/PostContent.js";
import formatPostData from "../utils/dataFormater.js";
import Likes from "../models/Likes.js";
import Comments from "../models/Comments.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteImage.js";
import redisClient from "../utils/redisClient.js";

import { EXPIRATION } from "../config/constants.js";
import Archive from "../models/Archive.js";


export const AddNewPost = async (req, res, next) => {
      // Parse and extract required data
    const parsedBlogData = JSON.parse(req.body.blog);
    const topic = req.body.Topic.toLowerCase();
    const postTitle = parsedBlogData.find((p) => p.index === 0)?.data;
    const subtitleParagraph = parsedBlogData.at(1)?.data;
    const imageFileArray = req.files || [];
  try {
    // Validate incoming request
    if (!req.body.blog || !req.body.Topic) {
      return res.status(400).json({ error: "Blog data or topic is missing" });
    }


    if (!postTitle || !subtitleParagraph) {
      return res.status(400).json({ error: "Invalid title or subtitle data provided" });
    }

    // Handle title image

    const titleImage = imageFileArray.at(0);
    const titleImageUrl = (await cloudinary.uploader.upload(titleImage?.path));

    // Create a new post
    const newPost = await Post.create({
      title: postTitle,
      subtitelpagraph: subtitleParagraph,
      titleImage: titleImageUrl.secure_url,
      cloudinaryPubId:titleImageUrl.public_id,
      topic,
      authorId: req.authUser.id,
    });


    // Filter additional images (skipping the first one, which is the title image)
    const imageFiles = imageFileArray.slice(1);

    // Map additional images
    const imageMap = new Map();
    const publicIdMap = new Map()
    
    // Upload additional images in parallel
    const imageUploads = imageFiles.map(async (img) => {
      const key = Number(img?.fieldname.split("-")[1]);
      if (!isNaN(key)) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(img.path);
        return { index: key, imageUrl: secure_url, cloudinaryPubId: public_id };
      }
    });

    const uploadedImages = (await Promise.all(imageUploads)).filter(Boolean); // Remove undefined values
    for (const img of uploadedImages) { 
      imageMap.set(img.index, img.imageUrl);
      publicIdMap.set(img.index, img.cloudinaryPubId);

    }
    
    // Arrange post content
    const postData = parsedBlogData
      .filter((p) => p.index > 1) // Skip title and subtitle
      .map((p) => ({
        type: p.type,
        content: p.type === "image" ? imageMap.get(p.index) || null : p.data,
        otherInfo: p.type === "image" ? p.data : "",
        cloudinaryPubId:p.type === "image"?publicIdMap.get(p.index):'',
        index: p.index,
        postId: newPost.id,
      }))
      .filter((p) => p.content); // Exclude items without content
    
    // Bulk insert all post content in one go
    if (postData.length) {
      await PostContent.bulkCreate(postData);
    }

    // Delete temp uploaded images if any
    if (imageFileArray.length) {
      await deletePostImage(imageFileArray);
    }
    // Send success response
    return res.status(201).json({ newPost, message: "Post created successfully" });
  } catch (error) {
    console.error("Error adding new post:", error.message);
    next(error);
  }
};


export const getPostPreview = async (req, res, next) => {
  const type = req.query.type?.toLowerCase().trim() || "all";
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const currentUserId = req.authUser.id;
  const topicFilter =
    type !== "all"
      ? {
          topic: {
            [Op.iLike]: `%${type}%`, // Optimized LIKE query
          },
        }
      : {};


  try {

    const cacheKey = `post_preview_${lastTimestamp}_${type}_${limit}`;
    // Unique cache key for this combination
    // Checking Cache
    const cachedPostData = await redisClient.get(cacheKey);
    if (cachedPostData !== null) {
      console.log('cach hit')
      return res.status(200).json(JSON.parse(cachedPostData));// Send cached data
    }
    console.log('cach miss')

     // Fetch posts from DB if not in redis cache
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "userImage"],
        },
        {
          model: Likes,
          as: "Likes",
        },
        {
          model: Comments,
          as: "comments",
        },
      ],
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
        ...topicFilter,
      },
      order: [
        ["createdAt", "DESC"],
      ],
      limit,
    });
   const postData = formatPostData(JSON.parse(JSON.stringify(posts))); // Format the post data
  
    // Caching the result to redis with expiration time
    await redisClient.setEx(cacheKey,EXPIRATION,JSON.stringify(postData))
    res.status(200).json(postData)

  } catch (error) {
    console.error("Error fetching posts:", error.message);
    next(error); // Pass the error to the error handling middleware
  }
};


// Fetch a post by its ID along with associated content and images
export const getPostView = async (req, res, next) => {
  const id = req.params.id;

  // console.log("first")
  try {
    const cachedData = await redisClient.get(id);
      if (cachedData !== null) {
      console.log('cach hit')
      return res.status(200).json(JSON.parse(cachedData));
    }
    console.log('cach miss')
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "username", "userImage"],
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
        },
        {
          model: PostContent,
          as: "postContent",
          required: false,
        },
            {
          model: Comments,
          as: "comments",

        }
      ],
    });
    if (post) {
      await redisClient.setEx(id, EXPIRATION, JSON.stringify(post));
      res.status(200).json(post);
    }else {
      return res.status(404).json({ message: "post not found" });
    }

  } catch (error) {
    console.error("Error fetching post:", error);
    // res.status(500).send('Server error');
    next(error);
  }
};
export const getArchivedPosts = async (req, res, next) => {
  const userId = req.authUser.id;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();

  try {
    const savedPosts = await Archive.findAll({
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
        userId
      },
      attributes: ["createdAt"],
      include: [
        {
          model: Post,
          as: "post",
          required: true,
          
          include: [
            {
              model: User,
              attributes: ["id", "username", "userImage"],
            },
            {
              model: Likes,
              as: "Likes",
              required: false,
            },
            {
              model: PostContent,
              as: "postContent",
              required: false,
            },
            {
              model: Comments,
              as: "comments",
              required: false,
            },
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const posts = savedPosts.map((archive) => archive.post);
    const postData = formatPostData(JSON.parse(JSON.stringify(posts)));
    
    res.status(200).json(postData);
  } catch (error) {
    console.error("Error fetching archived posts:", error);
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
    // res.status(500).send('Server error');
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
          model: PostContent,
          as: "postContent",
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
      return res.status(404).json({ message: "Post not found or you are not an author" });
    }

    // Extract Cloudinary image IDs title image and content images
    const imagePubIdArry = [
      post.cloudinaryPubId,
      ...post.postContent.flatMap(({ cloudinaryPubId }) => cloudinaryPubId || []),
    ].filter(Boolean);

    // Delete images in parallel if there are any
    if (imagePubIdArry.length) {
      await Promise.all(imagePubIdArry.map(deleteCloudinaryImage));
    }

    // Delete comments & post in parallel
    await Promise.all([
      Comments.destroy({ where: { postId } }),
      post.destroy(),
    ]);

    await redisClient.del(postId)

    return res.status(200).json({ id: postId, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    next(error);
  }
};
