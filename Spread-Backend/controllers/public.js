import sequelize,{ Op, Sequelize, where} from "sequelize";
import User from "../models/user.js";
import Post from "../models/posts.js";
import Follow from "../models/Follow.js";
import Archive from "../models/Archive.js";
import Likes from "../models/Likes.js";
import { DataFetching } from "../operations/data-fetching.js";
const dataFetcher = new DataFetching()
// Fetch all users except the current user and distinct topics
export const userPrepsData = async (req, res,next) => {
    try {
        // Fetch users excluding the current user
        const AllSpreadUsers = await User.findAll({
          where: { id: { [Op.ne]: req.authUser.id } },
          incluse: [ {
            model: User,
            as: 'Followers',
            through: { attributes: [] }, // Exclude through table attributes
            attributes: ['id'], // Fetch only necessary fields
          },
          {
            model: User,
            as: 'Following',
            through: { attributes: [] }, // Exclude through table attributes
            attributes: ['id'], // Fetch only necessary fields
          },],
          
            attributes: ['id', 'username', 'userImage', 'bio'],
            order: [[sequelize.fn('RANDOM')]], // Random order
            
            limit: 3
        });

        // Fetch distinct topics
        const topics = await Post.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('topic')), 'topic']
            ],
            order: [['topic', 'ASC']],
            limit: 7,
        });

        res.status(200).json({ topics, AllSpreadUsers });
    } catch (error) {
        console.error('Error fetching utility data:', error);
      // res.status(500).send('Server error');
      next(error)
    }
};

// Search for posts based on a query string
export const searchData = async (req, res,next) => {
    const searchQuery = req.query.q;
    
    try {
        const searchResult = await Post.findAll({
            where: {
                [Op.or]: [
                    {
                        topic: {
                            [Op.or]: [
                                { [Op.like]: `${searchQuery}%` },
                                { [Op.like]: `%${searchQuery}%` },
                                { [Op.like]: `${searchQuery}` }
                            ]
                        }
                    },
                    {
                        title: {
                            [Op.or]: [
                                { [Op.like]: `${searchQuery}%` },
                                { [Op.like]: `%${searchQuery}%` },
                                { [Op.like]: `${searchQuery}` }
                            ]
                        }
                    }
                ]
            },
            // attributes: [],
            limit: 10
        });
        res.status(200).json(searchResult);
    } catch (error) {
        console.error('Error searching data:', error);
      // res.status(500).json({ error: 'An error occurred while searching data' });
      next(error)
    }
};

export const LikePost = async (req, res, next) => {
    const postId = req.body.likedPostId;
  console.log({ postId })
  console.log({likedBy: req.authUser.id,})
  
    try {
        const exist = await Likes.findOne({ where: { likedBy: req.authUser.id, postId: postId } });
        // console.log(exist)
        if (exist) {
          await exist.destroy();
          const updtLikes = await Likes.findAll({ where: { postId }})

          res.status(201).json({ message: 'removed like',updtLikes})
        }else{
          const result = await Likes.create({ likedBy: req.authUser.id, postId });
          const updtLikes = await Likes.findAll({where:{postId}})
        // console.log('like',result)
          res.status(201).json({ message: 'added like',updtLikes})
        }
    } catch (error) {
        next(error)
    }
    
}

// Follow/unfollow a user
export const FollowUser = async (req, res, next) => {
  const { followerId, followedId } = req.body;

  // Prevent users from following themselves
  if (followerId === followedId) {
    return res.status(400).json({ status: "error", message: "You cannot follow yourself" });
  }

  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ where: { followerId, followedId } });

    if (existingFollow) {
      // Unfollow user
      await existingFollow.destroy();
      const userInfo = await dataFetcher.Profile(req.authUser.id);
      console.log(userInfo);

      // Optionally clear Redis cache if implemented
      // await redisClient.del(followerId);

      res
        .status(200)
        .cookie("_userDetail",userInfo, { httpOnly: true }) // Serialize object before storing
        .json({ message: "Unfollowed successfully" });
    } else {
      // Follow user
      await Follow.create({ followerId, followedId });
      const userInfo = await dataFetcher.Profile(req.authUser.id);
      console.log(userInfo);

      // Optionally clear Redis cache if implemented
      // await redisClient.del(followerId);

      res
        .status(201)
        .cookie("_userDetail",userInfo, { httpOnly: true }) // Serialize object before storing
        .json({ status: "success", message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error in FollowUser:", error);

    // General error handling
    res.status(500).json({ status: "error", message: "An error occurred. Please try again later." });
    next(error);
  }
};




// Add a post to the user's archive
export const AddPostToArchive = async (req, res,next) => {
  const { postId } = req.body;

  try {
    const exist = await Archive.findOne({
      where:{PostId: postId,
      UserId: req.authUser.id}
    });
    console.log({ exist })
    if (exist) {
      await exist.destroy();
    const userInfo = await dataFetcher.Profile( req.authUser.id)
        //  await redisClient.del(UserId);
    return res.status(200).cookie("_userDetail",userInfo,{httpOnly:true}).json({message:'succesfully removes'})
    }

    const archived = await Archive.create({
      PostId: postId,
      UserId: req.authUser.id
    });
          const userInfo = await dataFetcher.Profile( req.authUser.id)
          // await redisClient.del(req.authUser.id);
    res.status(200).cookie("_userDetail",userInfo,{httpOnly:true}).json({ message: 'Post archived successfully', archived });
  } catch (error) {
    console.error('Error archiving post:', error);
    // res.status(500).json({ message: 'An error occurred while archiving the post' });
    next(error)
  }
};

// Remove archived post for current user
export const removeFromArchive = async (req, res,next) => {
  const UserId = req.authUser.id;
  const postId = req.query.id
  console.log({postId})
try {
        const exist = await Archive.findOne({
        where:{PostId: postId,UserId}
        });
  if (exist) {
    
  }
} catch (error) {
   console.error('Error archiving post:', error);
  // res.status(500).json({ message: 'An error occurred while archiving the post' });
  next(error)

}
} 
