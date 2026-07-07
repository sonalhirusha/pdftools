# PDFTools

A complete, production-ready online PDF tools website built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma 7**, and **PostgreSQL** (Neon). Features 30+ PDF tools, AI chat with PDFs, authentication, blog, admin panel, and full SEO optimization.

## Features

- **30+ PDF Tools** - Merge, split, compress, convert, edit, and secure PDFs
- **AI Chat with PDF** - Chat with your documents using Google Gemini AI (free tier)
- **Authentication** - Email/password, Google OAuth, password reset, email verification
- **User Dashboard** - File history, tool usage, favorites, downloads, profile management
- **Admin Panel** - User management, analytics, blog management, settings
- **Blog System** - Categories, tags, SEO, RSS feed, pagination
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, JSON-LD, sitemap, robots.txt
- **PWA Support** - Installable, offline caching, service worker, manifest
- **Dark Mode** - Light, dark, and system theme support
- **Responsive Design** - Mobile-first, works on all devices
- **Security** - Rate limiting, CSRF, XSS protection, secure headers, file validation
- **Docker Support** - Dockerfile, docker-compose.yml, Nginx configuration

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Neon) + Prisma 7 + Neon serverless adapter
- **Authentication:** JWT + bcryptjs + Google OAuth
- **AI:** Google Gemini (`gemini-2.0-flash`, free tier)
- **PDF Processing:** pdf-lib, sharp, exceljs, mammoth
- **Email:** Nodemailer
- **Deployment:** Vercel (serverless) / Docker + Nginx (self-hosted)

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16+ (or Neon cloud database)
- npm or pnpm
- Google Gemini API key (free) — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zeroclothing23/pdf.git
   cd pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Required vars: `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`, `GEMINI_API_KEY`

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

After seeding:
- **Admin:** admin@pdftools.com / Admin123!
- **User:** user@example.com / User1234!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `SMTP_HOST` | SMTP server host | No |
| `SMTP_PORT` | SMTP server port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |
| `SMTP_FROM` | From email address | No |
| `UPLOAD_DIR` | File upload directory | No |
| `MAX_FILE_SIZE` | Maximum upload size (bytes) | No |
| `AUTO_DELETE_HOURS` | Auto-delete interval (hours) | No |
| `GA_MEASUREMENT_ID` | Google Analytics ID | No |
| `CLARITY_ID` | Microsoft Clarity ID | No |

## Deploy

### Building for Production

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker compose up -d
```

### Environment Configuration

Copy `.env.example` to `.env` and fill in the required values before starting the application.

## Project Structure

```
pdftools/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── next.config.ts
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/
│   │   ├── tools/
│   │   ├── blog/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── about/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── pricing/
│   │   ├── api/
│   │   ├── sitemap.ts
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── tools/
│   │   └── ads/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── pdf.ts
│   │   ├── email.ts
│   │   ├── tools.ts
│   │   ├── file-storage.ts
│   │   └── rate-limit.ts
│   ├── hooks/
│   ├── types/
│   └── styles/
└── docs/
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Verify email
- `GET /api/auth/google` - Google OAuth

### Tools
- `POST /api/tools/[tool]` - Process PDF tool

### Files
- `POST /api/upload` - Upload files
- `GET /api/download/[id]` - Download file

### Dashboard
- `GET /api/dashboard` - User dashboard data
- `GET /api/dashboard/favorites` - Favorite tools
- `POST /api/dashboard/favorites` - Add favorite
- `DELETE /api/dashboard/favorites` - Remove favorite
- `GET /api/dashboard/downloads` - Download history
- `GET /api/dashboard/activity` - Recent activity

### Admin
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - User management
- `GET/POST /api/admin/blog` - Blog management
- `GET /api/admin/newsletter` - Newsletter subscribers
- `GET /api/admin/settings` - Site settings
- `GET /api/admin/errors` - Error logs
- `GET /api/admin/files` - File management
- `GET /api/admin/announcements` - Announcements

### Public
- `POST /api/contact` - Contact form
- `POST/DELETE /api/newsletter` - Newsletter subscription
- `GET /api/search` - Global search
- `GET /api/robots` - robots.txt
- `GET /api/rss` - RSS feed
- `GET /sitemap.xml` - Sitemap

## License

This project is licensed under the MIT License.
# pdf
# pdfnew
