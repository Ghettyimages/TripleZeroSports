import { buildConfig } from "payload/config";
import path from "path";
import { fileURLToPath } from "url";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  serverURL: process.env.CMS_PUBLIC_URL, // optional, for absolute links
  admin: {
    user: "users",
    meta: {
      titleSuffix: " • Triple Zero Sports CMS"
    }
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: []
    },
    Authors,
    Tags,
    Posts
  ],
  db: {
    adapter: "postgres",
    url: process.env.DATABASE_URL!,
    pool: { min: 0, max: 10 }
  },
  typescript: {
    outputFile: path.resolve(__dirname, "../payload-types.ts")
  }
});