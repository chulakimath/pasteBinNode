import { postsMigration } from "../models/posts.model.js";

const migrate = async () => {
  try {
    Promise.all([postsMigration()]);
    console.log("Migration success");
  } catch (e) {
    console.log("ERROR config/Migration.js migrate");
  }
};
export default migrate;
