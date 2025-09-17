import type { CollectionConfig } from 'payload/types';
import { generateSlug } from '../utils/generateSlug';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && !data.slug) {
          data.slug = generateSlug(data.name);
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Trigger revalidation webhook
        await req.payload.sendWebhook({
          url: `${process.env.WEB_URL}/api/revalidate`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: ['/', `/tag/${doc.slug}`, '/sitemap.xml'],
          }),
        });
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return generateSlug(data.name);
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'select',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
        { label: 'Pink', value: 'pink' },
        { label: 'Gray', value: 'gray' },
      ],
      defaultValue: 'blue',
    },
  ],
};

