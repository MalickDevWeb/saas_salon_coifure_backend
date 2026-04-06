import dotenv from "dotenv";
import { buildApp } from "./infrastructure/api/app";

dotenv.config();

const port = Number(process.env.PORT ?? 3000);
const app = buildApp();

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
