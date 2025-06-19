
import client from "../pgclient.js";

const initMessageChangeListener = () => {
  client.query('LISTEN manual_change_channel');

  client.on('notification', async (msg) => {
    try {
      const payload = JSON.parse(msg.payload);
      console.log("📣 Manual DB Change Detected:", payload);

      // You can broadcast using socket.io, send webhook, etc.
      // For example:
      // import { io } from "../index.js";
      // io.emit("db_change", payload);
    } catch (err) {
      console.error("Error parsing DB payload:", err);
    }
  });

  client.on("error", (err) => {
    console.error("❌ PG Notification Client Error:", err);
  });

  console.log("👂 PostgreSQL DB change listener initialized.");
};

export default initMessageChangeListener;
