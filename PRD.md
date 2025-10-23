# Next.js 16 Starter Template - Development Guide

## Project Overview
Build a complete Next.js 16 starter template with authentication, authorization, and role-based access control.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui
- **Environment**: dotenv
- **Dev Dependencies**: drizzle-kit, tsx, @types/pg

## Database Schema (Drizzle ORM)

### Tables Required:
1. **users**
   - id (uuid, primary key)
   - name (text)
   - email (text, unique)
   - emailVerified (timestamp)
   - image (text)
   - password (text, hashed - untuk email/password auth)
   - role (enum: 'user', 'admin') - default: 'user'
   - createdAt (timestamp)
   - updatedAt (timestamp)

2. **accounts** (untuk OAuth)
   - id (uuid, primary key)
   - userId (uuid, foreign key)
   - type (text)
   - provider (text)
   - providerAccountId (text)
   - refresh_token (text)
   - access_token (text)
   - expires_at (integer)
   - token_type (text)
   - scope (text)
   - id_token (text)
   - session_state (text)

3. **sessions**
   - id (uuid, primary key)
   - sessionToken (text, unique)
   - userId (uuid, foreign key)
   - expires (timestamp)

4. **verificationTokens** (untuk reset password)
   - identifier (text)
   - token (text, unique)
   - expires (timestamp)

## Authentication Setup (NextAuth.js v5)

### Configuration:
- **Providers**: Google OAuth, Credentials (email/password)
- **Callbacks**: 
  - jwt: include user role in token
  - session: include user role and id in session
- **Pages**: Custom auth pages (login, register, reset-password)
- **Adapter**: Drizzle Adapter for PostgreSQL

### Middleware Protection:
- Protect `/admin/*` routes - hanya role admin
- Protect `/dashboard` dan `/profile` - authenticated users
- Redirect unauthenticated users ke `/login`
- Redirect admin ke `/admin/dashboard`, user ke `/dashboard` setelah login

## Routing Structure

### Public Routes:
- `/login` - Login page (email/password + Google OAuth button)
- `/register` - Registration page (email/password)
- `/reset-password` - Reset password page
- `/` - Landing page / redirect berdasarkan auth status

### User Routes (Authenticated):
- `/dashboard` - User dashboard
- `/profile` - User profile dengan tabs:
  - Account Information (edit nama, email, foto)
  - Change Password (form change password)

### Admin Routes (Role: admin):
- `/admin/dashboard` - Admin dashboard
- `/admin/profile` - Admin profile dengan tabs:
  - Account Information (edit nama, email, foto)
  - Change Password (form change password)

## UI Components & Layout

### Sidebar Layout (Admin & User):
**Structure:**
- Logo/Brand di top
- Navigation menu items:
  - Dashboard (icon + text)
- Profile menu di bottom dengan dropdown:
  - User info (avatar, name, email)
  - Account Setting → link ke profile page
  - Logout button

**Implementation:**
- Gunakan shadcn/ui components: 
  - Sidebar component
  - DropdownMenu untuk profile menu
  - Avatar untuk user photo
  - Button, Separator
- Responsive: collapse to icon-only di mobile
- Active state pada menu yang sedang dibuka

### Profile Page Tabs:
**Tab 1: Account Information**
- Form fields: Name, Email, Profile Photo (upload/change)
- Save button untuk update data
- Validation & error handling

**Tab 2: Change Password**
- Form fields: Current Password, New Password, Confirm New Password
- Password strength indicator
- Save button untuk update password
- Success/error notifications

## Authentication Features

### Login (`/login`):
- Email & Password form
- "Sign in with Google" button
- Link ke Register
- Link ke Reset Password
- Form validation
- Error messages untuk failed login

### Register (`/register`):
- Form: Name, Email, Password, Confirm Password
- Password requirements display
- Automatic login setelah register
- Default role: 'user'
- Link kembali ke Login

### Reset Password (`/reset-password`):
- Step 1: Enter email, kirim reset token
- Step 2: Enter token + new password
- Expiring tokens (24 hours)
- Email notification (gunakan console.log untuk dev)

## Security Implementation

1. **Password Hashing**: bcrypt/argon2
2. **CSRF Protection**: Built-in NextAuth
3. **Role-based Access Control**:
   - Middleware check role sebelum akses admin routes
   - API routes protection
4. **Environment Variables**: 
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET

## File Structure
```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── (user)/
│   │   ├── layout.tsx (dengan sidebar)
│   │   ├── dashboard/
│   │   └── profile/
│   ├── admin/
│   │   ├── layout.tsx (dengan sidebar)
│   │   ├── dashboard/
│   │   └── profile/
│   └── api/
│       └── auth/[...nextauth]/
├── components/
│   ├── ui/ (shadcn components)
│   ├── sidebar/
│   ├── profile-menu/
│   └── auth/
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── db.ts (Drizzle setup)
│   └── utils.ts
├── db/
│   ├── schema.ts (Drizzle schema)
│   └── migrate.ts
├── middleware.ts (route protection)
└── drizzle.config.ts
```

## Environment Setup (.env.local)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Development Steps

1. **Initialize Project**
   - `bunx create-next-app@latest` dengan App Router
   - Install dependencies

2. **Setup Database**
   - Create PostgreSQL database
   - Define Drizzle schema
   - Generate dan run migrations

3. **Configure NextAuth**
   - Setup auth.ts dengan providers
   - Configure Google OAuth
   - Setup Drizzle adapter

4. **Setup shadcn/ui**
   - Initialize shadcn
   - Install needed components

5. **Create Layouts & Components**
   - Sidebar component
   - Profile menu dropdown
   - Auth forms

6. **Implement Routes**
   - Auth pages
   - User routes
   - Admin routes

7. **Add Middleware**
   - Route protection
   - Role-based redirects

8. **Testing**
   - Test auth flow
   - Test role-based access
   - Test all CRUD operations

## Design Considerations

- **UI/UX**: Modern, clean, responsive design dengan shadcn/ui
- **Performance**: Optimized queries, proper caching
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Error Handling**: Proper error boundaries dan user feedback
- **Loading States**: Skeleton loaders, loading spinners
- **Toast Notifications**: Success/error messages menggunakan shadcn toast

## Additional Features (Optional)

- Email verification setelah register
- Remember me functionality
- Session management (multiple devices)
- Account deletion
- Activity logs
- 2FA (Two-factor authentication)
- Dark mode toggle
