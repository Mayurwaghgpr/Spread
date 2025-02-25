import dotenv from "dotenv";
import {Server} from "socket.io";
dotenv.config();
let io;

 const sockIo = {
    init: HttpServer => {
        io = new Server(HttpServer,{cors:{origin:[process.env.WHITLIST_ORIGINS],    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],credentials:true}})
        return io;
    },
    getIo: () => {
        if (io) {
            throw new Error('ioSocket not initialize')
        }
        return io;
    }
 }
export default sockIo