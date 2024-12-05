import Post from "../models/posts.js";
import sequelize, { Model, Op, Sequelize, where } from "sequelize";
import User from '../models/user.js';
import { deletePostImage } from "../utils/deleteImages.js";
import PostContent from "../models/PostContent.js";
import formatPostData from "../utils/dataFormater.js";
import Likes from "../models/Likes.js";
import { stringify } from "uuid";


// Fetch all posts with optional topic filtering, pagination, and user inclusion
export const getPostPreview = async (req, res,next) => {
    // Extract query parameters with defaults
    const type = req.query.type?.toLowerCase().trim() || 'all';
    const limit = parseInt(req.query.limit?.trim()) || 3;
    const page = parseInt(req.query.page?.trim()) || 1;
    console.log(type, limit, page)
    
    // Create a filter for topics if not 'all'
    const topicFilter = type !== 'all' ? { topic: { [Op.or]: [
        { [Op.like]: `${type}%` },
        { [Op.like]: `%${type}%` },
        { [Op.like]: `${type}` }
    ] } } : {};

    try {

        const {count:totalPosts,rows:posts} = await Post.findAndCountAll({
            where: topicFilter,
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'userImage']
                }, {
                    model: Likes,  // Include likes
                    as:'Likes',
                    required: false
                }],
            limit,
            offset: (page - 1) * limit
        
        });

        // const postLikes = await Likes.findAll({})
        if (posts.length > 0) {
            const postData = formatPostData(posts);// Assuming formatPostData is a function you've defined elsewhere
            res.status(200).json(postData); // Removed unnecessary spread operator
        } else {
            res.status(404).send('No posts found');
        }
    } catch (error) {
        console.error('Server error:', error);
        // res.status(500).send('Server error');
        next(error)
    }
};

// Fetch a post by its ID along with associated content and images
export const getPostView = async (req, res,next) => {
    const id = req.params.id;
// console.log("first")
    try {
        const post = await Post.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'username', 'userImage']
            }, {
                model: Likes,  // Include likes
                    as:'Likes',
                    required: false
                }, {
                model: PostContent,
                as: 'postContent',
                required: false
                }, ],
        });

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        // res.status(500).send('Server error');
        next(error)
    }
};



// Add a new post with associated content and images
export const AddNewPost = async (req, res, next) => {
    
    console.log("Post adding...")
    let imageArr = [];
    try {
        // console.log(req.body.blog)

        // Parse blog data and handle images
        const otherData = JSON.parse(req.body.blog);
        // console.log(otherData)

        const imageFileArray = req.files || [];
        console.log(imageFileArray)

        console.log(req.body)
        const topic = req.body.Topic.toLowerCase();console.log({topic})
        // extracting Title from Up-Comming Post data
        const postTitle = otherData.find(p => p.index === 0)?.data;
        // extracting Subtitle from Up-Comming Post data
        const subtitleParagraph = otherData.at(1)?.data;
        const titleImage = imageFileArray?.at(0);
        // console.log({postTitle,subtitleParagraph,titleImage})
        // console.log(postTitle ,subtitleParagraph ,titleImage)
        if (!postTitle || !subtitleParagraph) {
            return res.status(400).json({ error: 'Invalid data provided' });
        }
        // console.log(titleImage)
        const titleImageUrl = titleImage?.filename ? `images/${titleImage.filename}` : null;
        // Create new post
        const newPost = await Post.create({
            title: postTitle,
            subtitelpagraph: subtitleParagraph,
            titleImage:`${process.env.BASE_URL}${titleImageUrl}`,
            topic,
            authorId: req.authUser.id,
        });
        console.log(newPost)

        let PostData;
        const otherPostData = otherData.filter(p => p.index !== 0 && p.index !== 1)
        // Arranging post content in sequence
        if (otherData.length) {
            imageFileArray.forEach((image, idx) => {
                PostData = otherPostData.map(p => {
                    if (p.type === 'image' && idx !== 0 && p.index === Number(image.fieldname.split('-')[1])) {
                        return { type: p.type, content: `${process.env.BASE_URL}images/${image.filename}`, otherInfo: p.data, index: p.index, postId: newPost.id }
                    } else {
                        return { type: p.type, content: p.data, index: p.index, postId: newPost.id }
                    }
                });
            });
            await PostContent.bulkCreate(PostData);
        }
        res.status(201).json({ newData: newPost, message: 'Post created successfully' });
res.status(201)
    } catch (error) {
        // Clean up images if there's an error
        await deletePostImage(imageArr);
        console.error('Error adding new post:', error);
        // res.status(500).send('Server error');
        next(error)
    }
};

// Edit an existing post by its ID
export const EditPost = async (req, res,next) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Update post fields
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.author = req.body.author || post.author;
        post.date = new Date();

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error editing post:', error);
        // res.status(500).send('Server error');
        next(error)
    }
};
// Get archived posts for the current user
export const getArchivedPosts = async (req, res, next) => {
  console.log("getArchivedPosts....")
  const userId = req.authUser.id;
 const limit = req.query.limit?.trim() || 3; // Default limit to 3, min 1
  const page = req.query.page?.trim() || 1; // Default page to 1, min 1

console.log({userId})
  try {
    const Posts = await User.findByPk(userId, {
      include: [{
        model: Post,
        as:  'SavedPosts',
        through: { attributes: [] },
        include: [
          {
                    model: User,
                    attributes: ['id', 'username', 'userImage']
                }, {
                    model: Likes,  // Include likes
                    as:'Likes',
                    required: false
                }
        ],
 
      }],
      limit,
      offset: (page - 1) * limit
    });
    console.log(Posts?.SavedPosts)
    if (!Posts?.SavedPosts || Posts?.SavedPosts.length === 0) {
      return res.status(404).json({ message: 'No archived posts found' });
    }
  const postData = formatPostData(Posts?.SavedPosts);
    res.status(200).json(postData);
  } catch (error) {
    console.error('Error fetching archived posts:', error);
    // res.status(500).json({ message: 'An error occurred while fetching archived posts' });
    next(error)
  }
};
// Delete a post by its ID and associated images
export const DeletePost = async (req, res,next) => {
    const postId = req.params.postId;
console.log({postId})
    try {
        const post = await Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: PostContent,
                    as: 'postContent',
                    where: { type: 'image' },
                    attributes: ['content'],
                    required: false,
                },
            ],
            nest: true,
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const imageUrls = [];

        // Add title image to the array
        if (post.titleImage) {
            imageUrls.push(post.titleImage.split(process.env.BASE_URL)[1]);
        }

        // Add post content images to the array
        post.postContent.forEach(({ content }) => {
            if (content) {
                imageUrls.push(content.split(process.env.BASE_URL)[1]);
            }
        });

        // Delete images if present
        if (imageUrls.length > 0) {
            const imagesDeleted = await deletePostImage(imageUrls);
            console.log(imagesDeleted)
            if (!imagesDeleted) {
                return res.status(500).json({ message: 'Error deleting images' });
            }

                // Delete the post itself
                await post.destroy();
        }


        res.status(200).json({ id: postId, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        // res.status(500).json({ message: 'Server error' });
        next(error)
    }
};
