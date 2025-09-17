import type { CollectionConfig } from "payload/types";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: { useAsTitle: "title" },
  access: {
    read: ({ req }) => {
      // Only published posts are public
      if (req.user) return true;
      return {
        _status: { equals: "published" }
      };
    },
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "hero", type: "text" }, // image URL (Cloudinary optional later)
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "publishedAt", type: "date" },
    { name: "canonicalUrl", type: "text" },
    {
      name: "body",
      type: "richText",
      required: true
    }
  ]
};