import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deletePostImage = async (imageUrls) => {
    // console.log("unlike")
    try {
        // Use map to create an array of Promises returned by unlink
     imageUrls.forEach(async(url) => {
          await fs.unlink(path.join(__dirname,"..",url));
        });
        return 'All image files deleted successfully';
    } catch (err) {
        throw new Error(`Error deleting image files: ${err.message}`);
    }
};
