import Post from "../models/posts.js";
import sequelize, { Model, Op, Sequelize, where } from "sequelize";
import User from "../models/user.js";
import { deletePostImage } from "../utils/deleteImages.js";
import PostContent from "../models/PostContent.js";
import formatPostData from "../utils/dataFormater.js";
import Likes from "../models/Likes.js";
import { stringify } from "uuid";
import Comments from "../models/Comments.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteImage.js";

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

    // Map additional images
    const imageHasMap = new Map();
    const cloudinaryPublicId= new Map()
    const imagefilterArray=imageFileArray.filter((p,idx)=>idx>0&&p)
      for(const img of imagefilterArray) {
      const key = Number(img?.fieldname.split("-")[1]);
      if (!isNaN(key)) {
        const result = await cloudinary.uploader.upload(img.path);
        imageHasMap.set(key, result.secure_url);
        cloudinaryPublicId.set(key,result.public_id)
      }
    };

    // Arrange post content
    const PostData = parsedBlogData
      .filter((p) => p.index > 1) // Skip title and subtitle
      .map((p) => ({
        type: p.type,
        content: p.type === "image" ? imageHasMap.get(p.index) || null : p.data,
        otherInfo: p.type === "image" ? p.data : "",
        cloudinaryPubId:p.type === "image"?cloudinaryPublicId.get(p.index):'',
        index: p.index,
        postId: newPost.id,
      }))
      .filter((p) => p.content); // Exclude items without content

    await PostContent.bulkCreate(PostData);

     await deletePostImage(imageFileArray)

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
  const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);

  const topicFilter =
    type !== "all"
      ? {
          topic: {
            [Op.or]: [
              { [Op.like]: `${type}%` },
              { [Op.like]: `%${type}%` },
              { [Op.like]: `${type}` },
            ],
          },
        }
      : {};

  try {
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      where: topicFilter,
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
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]], // Optional: Order posts by creation date
    });
    console.log(posts)
    if (posts.length > 0) {
      const postData = formatPostData(posts); // Format the post data
      res.status(200).json({
        posts: postData,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          hasNextPage: page < Math.ceil(totalPosts / limit),
          totalPosts,
        },
      });
    } else {
      res.status(200).json({
        posts: [],
        meta: {
          currentPage: page,
          totalPages: 0,
          hasNextPage: false,
          totalPosts: 0,
        },
      });
    }
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

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    // res.status(500).send('Server error');
    next(error);
  }
};

export const getArchivedPosts = async (req, res, next) => {
  const userId = req.authUser.id;
  const limit = parseInt(req.query.limit?.trim()) || 3; // Default limit to 3, min 1
  const page = parseInt(req.query.page?.trim()) || 1; // Default page to 1, min 1

  try {
    const Posts = await User.findByPk(userId, {
      include: [
        {
          model: Post,
          as: "SavedPosts",
          through: { attributes: [] }, // Exclude the intermediate table attributes

          include: [
            {
              model: User,
              attributes: ["id", "username", "userImage"], // Include the post owner details
            },
            {
              model: Likes, // Include likes
              as: "Likes",
              required: false,
            },
             {
          model: Comments,
          as: "comments",
        }
          ],
        },
      ],
      limit,
      offset: (page - 1) * limit,
    });

    if (!Posts?.SavedPosts) {
      return res.status(404).json({ message: "No archived posts found" });
    }
    console.log(Posts);
    const postData = formatPostData(Posts.SavedPosts);
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
  const postId = req.params.postId;
  
  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: PostContent,
          as: "postContent",
          where: { type: "image" },
          attributes: ["content","cloudinaryPubId"],
          required: false,
        },
          {
          model: Comments,
          as: "comments",  // Include associated comments
        },
      ],
      nest: true,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
  // Delete associated comments
    await Comments.destroy({ where: { postId } });
    
    const imagePubIdArry = [];

    // Add title image to the array
    if (post.cloudinaryPubId) {
      imagePubIdArry.push(post.cloudinaryPubId);
    }

    // Add post content images to the array
    post.postContent.forEach(({ cloudinaryPubId }) => {
      if (cloudinaryPubId) {
        imagePubIdArry.push(cloudinaryPubId);
      }
    });
    
    // If there are images, delete them
    const imagePromiesArry = imagePubIdArry.map(async (public_id) => {
      console.log({public_id})
      return deleteCloudinaryImage(public_id);
    })

  const deleteResult = await Promise.all(imagePromiesArry)

    console.log(deleteResult)

    // Delete the post itself
    await post.destroy();

    res.status(200).json({ id: postId, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    next(error); // Pass the error to the next middleware for handling
  }
};
