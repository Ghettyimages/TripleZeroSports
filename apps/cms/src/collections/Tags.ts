import type { CollectionConfig } from "payload/types";
import slugify from "slugify";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: { useAsTitle: "name" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
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
  ],
};