import path from 'path';
import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import { cloudStorage, cloudinaryAdapter } from '@payloadcms/plugin-cloud-storage';

// Collections
import { Posts } from './collections/Posts';
import { Tags } from './collections/Tags';
import { Authors } from './collections/Authors';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

// Endpoints
import health from './endpoints/health';

const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- TripleZeroSports CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  editor: slateEditor({}),
  collections: [Posts, Tags, Authors, Media, Users],
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: health,
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    ...(cloudinaryEnabled
      ? [
          cloudStorage({
            collections: {
              media: {
                adapter: cloudinaryAdapter({
                  cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
                  apiKey: process.env.CLOUDINARY_API_KEY as string,
                  apiSecret: process.env.CLOUDINARY_API_SECRET as string,
                  folder: 'triplezerosports',
                }),
              },
            },
          }),
        ]
      : []),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: [
    process.env.WEB_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  csrf: [
    process.env.WEB_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
});
