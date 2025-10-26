# Next.js 16 Starter Template

A complete Next.js 16 starter template with authentication, authorization, and role-based access control built with modern technologies.

## 🚀 Features

- **Next.js 16** with App Router
- **Authentication** with NextAuth.js v5 (beta)
- **Database** with PostgreSQL and Drizzle ORM
- **UI Components** with shadcn/ui and Tailwind CSS v4
- **Role-Based Access Control** (User & Admin roles)
- **Responsive Design** with mobile-friendly sidebar
- **Password Reset** functionality
- **Google OAuth** integration
- **TypeScript** support
- **Bun** runtime

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Environment**: dotenv
- **Dev Dependencies**: drizzle-kit, tsx, @types/pg

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Google OAuth credentials (optional)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-starter
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_starter"
   NEXTAUTH_SECRET="generate-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate database migrations
   bun run db:generate

   # Run migrations
   bun run db:migrate

   # Seed the database with test users
   bun run db:seed
   ```

5. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Default Users

After seeding the database, you can use these test accounts:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123456`
- Role: Admin

**Regular User:**
- Email: `user@example.com`
- Password: `user123456`
- Role: User

## 🏗️ Project Structure

```
/
├── app/
│   ├── (auth)/              # Authentication routes (login, register, reset-password)
│   ├── (user)/              # User-protected routes with sidebar layout
│   │   ├── dashboard/       # User dashboard
│   │   └── profile/         # User profile with tabs
│   ├── admin/               # Admin-protected routes with admin layout
│   │   ├── dashboard/       # Admin dashboard
│   │   └── profile/         # Admin profile with tabs
│   └── api/                 # API routes
│       ├── auth/            # NextAuth.js endpoints
│       ├── user/            # User management APIs
│       └── admin/           # Admin management APIs
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── sidebar/             # Sidebar navigation component
│   ├── profile-menu/        # Profile dropdown menu
│   ├── theme-provider/      # Theme context provider
│   └── session-provider/    # Session context provider
├── lib/
│   ├── auth.ts              # NextAuth.js configuration
│   ├── db.ts                # Database connection
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
├── db/
│   ├── schema.ts            # Drizzle ORM schema
│   ├── migrate.ts           # Database migration script
│   └── seed.ts              # Database seeding script
├── middleware.ts            # Route protection middleware
├── drizzle.config.ts        # Drizzle configuration
└── .env.local.example       # Environment variables template
```

## 📝 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `db:generate` - Generate database migrations
- `db:migrate` - Run database migrations
- `db:studio` - Open Drizzle Studio (database GUI)
- `db:seed` - Seed database with test data

## 🔐 Authentication Features

### User Registration & Login
- Email/password authentication
- Google OAuth integration
- Form validation and error handling
- Automatic role-based redirects after login

### Password Management
- Secure password reset flow with email tokens
- Password change functionality
- Bcrypt password hashing

### Role-Based Access Control
- User role with access to `/dashboard` and `/profile`
- Admin role with access to `/admin/*` routes
- Middleware protection for all routes
- Role-based sidebar navigation

## 🎨 UI/UX Features

### Responsive Design
- Mobile-friendly sidebar that collapses to icon-only
- Optimized for desktop, tablet, and mobile devices
- Dark/light theme support

### User Experience
- Loading states and error boundaries
- Toast notifications for user feedback
- Intuitive navigation with active state indicators
- Profile dropdown with quick actions

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based session management
- CSRF protection via NextAuth.js
- Route protection with middleware
- Input validation and sanitization

## 📚 API Routes

### Authentication (`/api/auth/*`)
- NextAuth.js authentication endpoints
- Registration API
- Password reset request and confirmation

### User Management (`/api/user/*`)
- Profile management
- Password change

### Admin Management (`/api/admin/*`)
- User statistics
- Admin profile management
- Admin password change

## 🚀 Deployment

### Environment Setup
1. Set up your PostgreSQL database
2. Configure all environment variables
3. Run database migrations
4. Seed initial data if needed

### Build and Deploy
```bash
# Build for production
bun run build

# Start production server
bun run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
