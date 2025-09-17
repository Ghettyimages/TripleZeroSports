import type { CollectionConfig } from "payload/types";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: { useAsTitle: "name" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "bio", type: "textarea" },
    { name: "x", type: "text" },
    { name: "instagram", type: "text" },
    { name: "site", type: "text" }
  ],
};