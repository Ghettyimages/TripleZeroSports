import { buildConfig } from "payload/config";
import path from "path";
import { fileURLToPath } from "url";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  serverURL: process.env.CMS_PUBLIC_URL,
  admin: {
    user: "users",
    meta: {
      titleSuffix: " • Triple Zero Sports CMS"
    },
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
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
  },
  typescript: {
    outputFile: path.resolve(__dirname, "../payload-types.ts")
  }
});