import { readFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "db.json");

export async function readDB() {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
}
