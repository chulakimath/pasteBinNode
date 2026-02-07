import Pool from "../configs/dbConnection.js";
export const postsMigration = async () => {
  const query = `CREATE TABLE IF NOT EXISTS posts (
      id BIGSERIAL PRIMARY KEY,
      post_key VARCHAR(255),
      name VARCHAR(255),
      body TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      created_by BIGINT DEFAULT NULL,
      status BOOLEAN DEFAULT TRUE
    );
    `;
  try {
    await Pool.query(query);
    console.log("Migration - posts table");
  } catch (e) {
    console.log("ERROR /posts/model.js postsMigration ", e);
  }
};
const count = async () => {
  const query = `SELECT COUNT(*) AS length FROM posts`;
  const { rows } = await Pool.query(query);
  return rows;
};
const create = async (name, body, postId) => {
  const query = `INSERT INTO posts (post_key,name,body) VALUES($1,$2,$3) RETURNING *`;
  const { rows } = await Pool.query(query, [postId, name, body]);
  return rows;
};
export default { count, create };
