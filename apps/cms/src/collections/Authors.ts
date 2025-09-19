import type { CollectionConfig } from "payload/types";
import slugify from "slugify";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: { useAsTitle: "name" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { 
      name: "slug", 
      type: "text", 
      required: true, 
      unique: true,
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.name && !data?.slug) {
                data.slug = slugify(data.name, { lower: true, strict: true });
              }
            }
            return data;
          }
        ]
      }
    },
    { name: "bio", type: "textarea" },
    { name: "x", type: "text" },
    { name: "instagram", type: "text" },
    { name: "site", type: "text" }
  ],
};