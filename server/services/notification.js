// import redisClient from "../utils/redisClient.js";
// import Notification from '../models/Notification.js'
// // import { io } from "../app.js";

// export const startedFollowing = async(receiverId,actorId) => {
//    try {
//      // Notify the user being followed if they are online
//      const cacheKey = `socket_${receiverId}`;
//      const userSocketId = await redisClient.get(cacheKey);
//   //   const notification= await Notification.create({
//   //        type:'follow',
//   //        receiverId,
//   //        actorId,
//   //        message:'started following you'
//   //   })
//   //        // Fetch the notification with receiver & actor details
//   // const populatedNotification = await Notification.findOne({
//   //   where: { id: notification.id },
//   //   include: [
//   //     { model: User, as: "receiver", attributes: ["id", "name", "image"] },
//   //     { model: User, as: "actor", attributes: ["id", "name", "image"] },
//   //   ],
//   // });
//   //    console.log(populatedNotification)
//        if (userSocketId) {
//          io.to(userSocketId).emit("notification", populatedNotification);
//        }
//    } catch (error) {

//    }
// }
