# Next.js Authentication Setup Guide

This guide will help you set up and run the Next.js application with authentication system.

## ✅ Features

- 🔐 **NextAuth.js** authentication with local and Google OAuth providers
- 👤 **Role-based access control** (user/admin)
- 📸 **Avatar management** with upload/delete functionality
- 🗄️ **PostgreSQL** database with Drizzle ORM
- 🎨 **Modern UI** with shadcn/ui components
- 🔒 **Protected routes** with middleware
- 📱 **Responsive design** with Tailwind CSS

## 🛠️ Prerequisites

- **Node.js** (18+)
- **Bun** runtime
- **PostgreSQL** database

## 📋 Setup Steps

### 1. Environment Configuration

Copy the example environment file and update it:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_TRUST_HOST="true"

# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```sql
-- Create database
CREATE DATABASE nextjs_starter;

-- Create user (optional)
CREATE USER nextjs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nextjs_starter TO nextjs_user;
```

#### Option B: Supabase/Neon/etc.
Use your cloud PostgreSQL provider's connection string as `DATABASE_URL`.

### 3. Database Migration

Generate and run database migrations:

```bash
bun run db:generate  # Generate migration files
bun run db:migrate    # Run migrations
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to your `.env.local`

### 5. Start Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:3000` (or next available port).

## 🚀 Usage

### Authentication Flow

1. **Registration**: Visit `/register` to create a new account
   - Local signup with email/password
   - Google OAuth signup (includes avatar import)

2. **Login**: Visit `/login` to sign in
   - Email/password authentication
   - Google OAuth authentication

3. **Profile Management**: Visit `/profile` to:
   - Update personal information
   - Upload/change avatar
   - Change password

### Role-Based Access

- **Users**: Access to `/dashboard` and `/profile`
- **Admins**: Access to `/admin/dashboard` and `/admin/profile`

### Avatar Management

- **Google Sign-up**: Avatar automatically imported from Google profile
- **Manual Upload**: Upload custom avatar via profile page
- **Supported Formats**: JPEG, PNG, WebP, GIF (max 5MB)
- **Storage**: Files saved to `public/uploads/avatars/`

## 📁 Project Structure

```
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (user)/           # User protected pages
│   │   ├── dashboard/
│   │   └── profile/
│   ├── admin/            # Admin protected pages
│   │   ├── dashboard/
│   │   └── profile/
│   └── api/              # API routes
│       ├── auth/         # NextAuth routes
│       ├── avatar/       # Avatar management
│       ├── user/         # User API
│       └── admin/        # Admin API
├── components/
│   ├── ui/               # shadcn/ui components
│   └── profile-avatar.tsx # Avatar component
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   └── types.ts          # TypeScript types
└── db/
    ├── schema.ts         # Database schema
    └── migrations/       # Migration files
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: JWT-based sessions
- **CSRF Protection**: Built into NextAuth.js
- **Route Protection**: Middleware-based access control
- **Input Validation**: Zod schema validation
- **File Upload Security**: Type and size validation

## 🔧 Development Commands

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:generate  # Generate database migrations
bun run db:migrate    # Run database migrations
bun run db:studio     # Open Drizzle Studio
```

## 🐛 Troubleshooting

### Common Issues

1. **UntrustedHost Error**
   - Add `NEXTAUTH_TRUST_HOST="true"` to `.env.local`

2. **Database Connection Error**
   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check database exists

3. **Google OAuth Error**
   - Verify redirect URI in Google Console
   - Check Client ID and Secret
   - Ensure API is enabled

4. **Build Errors**
   - Ensure all environment variables are set
   - Check TypeScript types
   - Verify database schema

### Debug Mode

Add this to `.env.local` for debugging:
```env
NEXTAUTH_DEBUG=true
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://authjs.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.