import { Sequelize } from "sequelize";
import dotenv from "dotenv"


dotenv.config()

console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres"
  }
);
sequelize.authenticate()
    .then(() => console.log(" Database connected"))
    .catch(err => console.error(" DB Connection Error:", err));
    
export default sequelize;
