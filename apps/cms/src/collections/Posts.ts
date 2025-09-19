import type { CollectionConfig } from "payload/types";
import slugify from "slugify";

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
  // Temporarily disable versions to isolate the issue
  // versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { 
      name: "slug", 
      type: "text", 
      required: true, 
      unique: true,
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.title && !data?.slug) {
                data.slug = slugify(data.title, { lower: true, strict: true });
              }
            }
            return data;
          }
        ]
      }
    },
    { name: "description", type: "textarea" },
    { name: "hero", type: "text" }, // image URL (Cloudinary optional later)
    // Temporarily simplify relationships
    { name: "author_name", type: "text" }, // Simple text instead of relationship
    { name: "tag_names", type: "text" }, // Simple text instead of relationship
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