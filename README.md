# TripleZeroSports.com

A modern, production-ready sports news platform built with Payload CMS and Next.js 14. Features real-time content management, ISR optimization, and scalable architecture.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Ghettyimages/TripleZeroSports.git
cd TripleZeroSports

# Install dependencies
pnpm install

# Set up environment variables
cp env.example .env.local
cp apps/cms/env.example apps/cms/.env.local  
cp apps/web/env.example apps/web/.env.local

# Start development servers
pnpm dev
```

## 📋 Architecture Overview

This monorepo contains:

- **`apps/cms`**: Payload CMS with PostgreSQL and Cloudinary integration
- **`apps/web`**: Next.js 14 frontend with App Router and Tailwind CSS
- **`packages/types`**: Shared TypeScript types
- **`packages/config`**: Shared configuration (ESLint, etc.)

## 🔧 Environment Variables

### CMS (`apps/cms/.env.local`)
```bash
DATABASE_URL=postgres://user:password@localhost:5432/triplezerosports
PAYLOAD_SECRET=your-super-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
WEB_URL=http://localhost:3000
WEBHOOK_SECRET=your-webhook-secret-key
PORT=3001
```

### Web (`apps/web/.env.local`)
```bash
PAYLOAD_URL=http://localhost:3001
WEBHOOK_SECRET=your-webhook-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=triplezerosports.com
```

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database

### Method 1: Manual Setup

1. **Database Setup**
   ```bash
   # Using Docker (recommended)
   docker run --name triplezerosports-postgres \
     -e POSTGRES_DB=triplezerosports \
     -e POSTGRES_USER=triplezerosports \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment**
   - Copy environment files as shown above
   - Update database connection details
   - Set up Cloudinary account and add credentials

4. **Start Development**
   ```bash
   # Start both CMS and Web
   pnpm dev

   # Or start individually
   pnpm dev:cms  # Runs on :3001
   pnpm dev:web  # Runs on :3000
   ```

### Method 2: Docker Development

```bash
# Build and start services
docker-compose up --build

# Seed the database
docker-compose exec cms pnpm seed
```

## 📊 Database Seeding

The CMS includes a comprehensive seed script:

```bash
# Seed sample content
pnpm seed

# This creates:
# - Admin user (admin@triplezerosports.com / password123)
# - 4 tags (culture, breakdown, deals, beyond)
# - 2 authors
# - 6 sample posts (2 featured)
```

## 🔗 Webhook Configuration

1. **In Payload Admin** (`http://localhost:3001/admin`):
   - Go to Settings → Webhooks
   - Add new webhook
   - URL: `http://localhost:3000/api/revalidate`
   - Secret: Use the same `WEBHOOK_SECRET` from your env files
   - Events: Select `posts.*` and `tags.*`

2. **Test Revalidation**:
   - Publish/update a post in CMS
   - Check browser network tab for revalidation calls
   - Verify homepage updates instantly

## 🌐 Deployment to Render

### Step 1: Prepare Repository
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy Services

1. **Connect Render to GitHub**
   - Link your GitHub account
   - Select the TripleZeroSports repository

2. **Deploy Database**
   - Create PostgreSQL service
   - Note the connection string

3. **Deploy CMS**
   - Create Web Service from `apps/cms`
   - Set build command: `npm install -g pnpm && pnpm install && pnpm build:cms`
   - Set start command: `pnpm start:cms`
   - Add environment variables (see render.yaml)

4. **Deploy Web App**
   - Create Web Service from `apps/web`
   - Set build command: `npm install -g pnpm && pnpm install && pnpm build:web`
   - Set start command: `pnpm start:web`
   - Add environment variables

### Step 3: Configure Domain
- Point `cms.triplezerosports.com` → CMS service
- Point `triplezerosports.com` → Web service

### Step 4: Set Up Cloudinary
1. Create Cloudinary account
2. Get credentials from dashboard
3. Add to CMS environment variables
4. Update Next.js image domains if needed

## 📝 Content Management

### Adding a New Post

1. **In Payload Admin**:
   - Go to Posts → Create New
   - Fill required fields (title, description, body, hero image)
   - Select author and tags
   - Set featured status if needed
   - Publish when ready

2. **Automatic Features**:
   - Slug auto-generated from title
   - Reading time calculated
   - Webhook triggers revalidation
   - SEO metadata generated

### Adding a New Tag

1. **Create Tag**:
   - Go to Tags → Create New
   - Add name, description, and color
   - Slug auto-generated

2. **Expose in Navigation**:
   - Update `apps/web/src/config/site.ts`
   - Add to `nav` array and `tagDisplayMapping`
   - Restart web app for changes

### Managing Authors

1. **Create Author**:
   - Go to Authors → Create New
   - Add name, bio, avatar, social links
   - Slug auto-generated

2. **Assign to Posts**:
   - Authors available in post editor
   - Used for bylines and author cards

## 🔍 Search Configuration

The search functionality uses client-side indexing:

1. **Search Index**: Built automatically from all published posts
2. **Search Algorithm**: Fuse.js with weighted scoring
3. **Search Fields**: Title (40%), description (30%), tags (20%), author (10%)

To customize search:
- Edit `apps/web/src/app/search/page.tsx`
- Modify Fuse.js configuration
- Adjust search weights

## 🎨 Customization

### Theme Colors
Update `apps/web/src/config/site.ts`:
```typescript
theme: {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
  },
}
```

### Tag Colors
Update the `tagDisplayMapping` in site config:
```typescript
tagDisplayMapping: {
  culture: { name: 'Culture', color: 'blue' },
  // Add new tags here
}
```

### Analytics
Add tracking IDs to environment variables:
```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=triplezerosports.com
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📦 Available Scripts

```bash
# Development
pnpm dev          # Start both CMS and Web
pnpm dev:cms      # Start CMS only
pnpm dev:web      # Start Web only

# Building
pnpm build        # Build both apps
pnpm build:cms    # Build CMS only
pnpm build:web    # Build Web only

# Production
pnpm start        # Start both apps in production
pnpm start:cms    # Start CMS in production
pnpm start:web    # Start Web in production

# Database
pnpm seed         # Seed sample content

# Quality
pnpm lint         # Lint all packages
pnpm lint:fix     # Fix linting issues
pnpm test         # Run tests
pnpm clean        # Clean build artifacts
```

## 🔧 Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify credentials

2. **"Webhook failed"**
   - Check WEBHOOK_SECRET matches between CMS and Web
   - Verify Web app is accessible from CMS
   - Check network connectivity

3. **"Images not loading"**
   - Verify Cloudinary credentials
   - Check Next.js image domains configuration
   - Ensure upload collection is properly configured

4. **"Build failed on Render"**
   - Check build logs for specific errors
   - Verify environment variables are set
   - Ensure pnpm workspace configuration is correct

### Performance Optimization

1. **ISR Configuration**:
   - Default revalidate: 300 seconds (5 minutes)
   - Customize per page as needed
   - Use on-demand revalidation via webhooks

2. **Image Optimization**:
   - Next.js Image component with Cloudinary
   - Automatic format selection (WebP, AVIF)
   - Responsive sizing

3. **Caching Strategy**:
   - Static generation for most pages
   - ISR for dynamic content
   - API route caching for RSS/sitemap

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review Payload CMS and Next.js documentation

---

Built with ❤️ using [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org)