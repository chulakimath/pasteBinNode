import dotenv from "dotenv";
import { Pool } from "@neondatabase/serverless";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export default pool;

export async function connectDB() {
  try {
    // This forces an actual connection test
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed");
    throw err;
  }
}
