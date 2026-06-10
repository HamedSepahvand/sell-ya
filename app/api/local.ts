import { readFile } from "fs/promises"; // ← توجه: /promises
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "db.json");
export const fileContentDB = await readFile(filePath, "utf-8");
