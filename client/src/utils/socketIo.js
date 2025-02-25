
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const socket = io(BASE_URL, { withCredentials: true });
