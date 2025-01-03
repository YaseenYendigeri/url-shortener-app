import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import dbConfig from "#src/config/dbConfig";
import pg from "pg";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectModule: pg,
  maxConcurrentQueries: 100,
  benchmark: true,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
const excludedFiles = [".", "..", "index.js"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.resolve(__dirname, "./");
let files = await fs.readdir(modelsDir);
for (let fileName of files) {
  if (!excludedFiles.includes(fileName) && path.extname(fileName) === ".js") {
    const getModel = await import("./" + fileName);
    let model = await getModel.default(sequelize, DataTypes);
    db[model.name] = model;
  }
}
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

async function disconnectDb() {
  try {
    await sequelize.close();
    console.log("Database disconnected....");
  } catch (error) {
    console.error("Error while closing the database connection:", error);
  }
}

export { db, disconnectDb };
