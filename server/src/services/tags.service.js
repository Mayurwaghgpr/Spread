import { Op } from "sequelize";
import Tag from "../models/tags.model.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";

class TagService {
  async fetchTagsBySearch({ tag }) {
    const tagCacheKey = `tag_search${tag}`;
    const cachedTag = await redisClient.get(tagCacheKey);
    if (cachedTag) {
      return JSON.parse(cachedTag);
    }

    const tags = await Tag.findAll({
      where: {
        tagName: {
          [Op.or]: [
            { [Op.like]: `${tag}%` },
            { [Op.like]: `%${tag}%` },
            { [Op.like]: `${tag}` },
          ],
        },
      },
    });

    await redisClient.setEx(tagCacheKey, EXPIRATION, JSON.stringify(tag));
    return tags;
  }
  async fetchQuickTrendingTags() {
    const tagCacheKey = `quick_trend_tags`;
    const cachedTag = await redisClient.get(tagCacheKey);

    if (cachedTag) {
      return JSON.parse(cachedTag);
    }

    const tags = await Tag.findAll({ limit: 7 });
    if (tags) {
      await redisClient.setEx(tagCacheKey, EXPIRATION, JSON.stringify(tags));
    }
    return tags;
  }
}

export default new TagService();
