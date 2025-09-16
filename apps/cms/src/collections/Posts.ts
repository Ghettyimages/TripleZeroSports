import type { CollectionConfig } from 'payload/types';
import { generateSlug } from '../utils/generateSlug';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'featured', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Public can read published posts only
      if (!user) {
        return {
          _status: {
            equals: 'published',
          },
        };
      }
      // Authenticated users can read all
      return true;
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.title && !data.slug) {
          data.slug = generateSlug(data.title);
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        // Only trigger revalidation if the post is published or was published before
        const shouldRevalidate = 
          doc._status === 'published' || 
          (previousDoc && previousDoc._status === 'published');

        if (shouldRevalidate) {
          const paths = [
            '/',
            `/post/${doc.slug}`,
            '/rss.xml',
            '/sitemap.xml'
          ];

          // Add tag paths if the post has tags
          if (doc.tags && Array.isArray(doc.tags)) {
            doc.tags.forEach((tag: any) => {
              if (typeof tag === 'object' && tag.slug) {
                paths.push(`/tag/${tag.slug}`);
              }
            });
          }

          try {
            const response = await fetch(`${process.env.WEB_URL}/api/revalidate`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ paths }),
            });

            if (!response.ok) {
              req.payload.logger.error(`Revalidation failed: ${response.statusText}`);
            } else {
              req.payload.logger.info(`Revalidation triggered for paths: ${paths.join(', ')}`);
            }
          } catch (error) {
            req.payload.logger.error(`Revalidation error: ${error}`);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
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
            if (!value && data?.title) {
              return generateSlug(data.title);
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 160,
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.body) {
              // Calculate reading time based on body content
              const wordsPerMinute = 200;
              const textContent = JSON.stringify(data.body).replace(/[^a-zA-Z\s]/g, '');
              const wordCount = textContent.split(/\s+/).length;
              return Math.ceil(wordCount / wordsPerMinute);
            }
            return 1;
          },
        ],
      },
    },
  ],
};
