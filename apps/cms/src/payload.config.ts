import { buildConfig } from "payload/config";
import path from "path";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { slateEditor } from "@payloadcms/richtext-slate";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";

export default buildConfig({
  serverURL: process.env.CMS_PUBLIC_URL || "https://triplezerosports-cms.onrender.com",
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    }
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "../payload-types.ts")
  }
});