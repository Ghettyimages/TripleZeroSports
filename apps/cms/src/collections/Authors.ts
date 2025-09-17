import type { CollectionConfig } from 'payload/types';
import { generateSlug } from '../utils/generateSlug';

export const Authors: CollectionConfig = {
  slug: 'authors',
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
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'x',
          type: 'text',
          label: 'X (Twitter) Handle',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram Handle',
        },
        {
          name: 'site',
          type: 'text',
          label: 'Personal Website',
        },
      ],
    },
  ],
};

