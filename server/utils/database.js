import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const Database = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},

});

export default Database;
