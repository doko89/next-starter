# Database Seeding Guide

This guide covers database seeding for the Next.js Authentication System.

## 🌱 Overview

The seeder creates default users for development and testing purposes, including an admin user and regular users.

## 👥 Default Users

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123456`
- **Name**: Admin User
- **Role**: Admin
- **Avatar**: Blue-themed profile picture

### Regular Users
1. **Email**: `user@example.com`
   - **Password**: `user123456`
   - **Name**: Regular User
   - **Role**: User
   - **Avatar**: Cyan-themed profile picture

2. **Email**: `test@example.com`
   - **Password**: `test123456`
   - **Name**: Test User
   - **Role**: User
   - **Avatar**: Green-themed profile picture

## 🔧 Configuration

### Environment Variables

You can customize the admin user using environment variables:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Admin User
```

### Docker Environment

Add these to your `.env` file:

```env
# Admin User Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Admin User
```

## 🚀 Usage

### Local Development

```bash
# Seed all default users
bun run db:seed

# Create only admin user
bun run db:seed admin

# Reset admin password
bun run db:seed reset-password
bun run db:seed reset-password newpassword123
```

### Docker Development

```bash
# Seed all default users
./docker-setup.sh seed

# Create only admin user
./docker-setup.sh admin

# Reset admin password
./docker-setup.sh reset-pwd
./docker-setup.sh reset-pwd newpassword123
```

### Docker Production

```bash
# Execute seeder in container
docker-compose exec app bun run db:seed

# Create admin user only
docker-compose exec app bun run db:seed admin

# Reset admin password
docker-compose exec app bun run db:seed reset-password newpassword123
```

## 📝 Seeder Commands

### Full Seeding
Creates all default users if they don't exist:
```bash
bun run db:seed
```

### Admin User Only
Creates only the admin user:
```bash
bun run db:seed admin
```

### Reset Admin Password
Resets the admin user password:
```bash
bun run db:seed reset-password [new_password]
```

## 🔒 Security Notes

### Production Deployment
1. **Change default passwords** immediately after deployment
2. **Remove or disable seeder** in production
3. **Use strong passwords** for admin accounts
4. **Enable 2FA** if available

### Password Security
- Default passwords use **12-character length**
- Passwords are hashed with **bcrypt (cost 12)**
- Consider using password managers
- Rotate passwords regularly

### Environment Security
- Never commit `.env` files with real credentials
- Use different passwords for different environments
- Use secure random passwords in production

## 🛠️ Advanced Usage

### Custom Admin User

```bash
# Using environment variables
ADMIN_EMAIL=myadmin@company.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME="Company Admin"
bun run db:seed admin
```

### Programmatic Usage

```typescript
import { createAdminUser, resetAdminPassword } from './db/seed'

// Create custom admin user
await createAdminUser({
  email: 'custom@example.com',
  password: 'custom123456',
  name: 'Custom Admin'
})

// Reset admin password
await resetAdminPassword('newPassword123')
```

### Bulk User Creation

```typescript
import { db } from './lib/db'
import { users } from './db/schema'
import { bcrypt } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const users = [
  { name: 'User 1', email: 'user1@example.com', password: 'password1' },
  { name: 'User 2', email: 'user2@example.com', password: 'password2' },
]

for (const user of users) {
  const hashedPassword = await bcrypt.hash(user.password, 12)
  await db.insert(users).values({
    id: uuidv4(),
    ...user,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database connection
bun run db:migrate

# Verify DATABASE_URL
echo $DATABASE_URL
```

#### 2. User Already Exists
```bash
# The seeder will skip existing users automatically
# Check existing users
psql $DATABASE_URL -c "SELECT email, role FROM users;"
```

#### 3. Permission Denied
```bash
# Check file permissions
ls -la db/

# Ensure executable permissions
chmod +x docker-setup.sh
```

#### 4. Docker Container Issues
```bash
# Check container logs
docker-compose logs app

# Restart container
docker-compose restart app

# Execute commands manually
docker-compose exec app bun run db:seed
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true bun run db:seed

# Verbose output
bun run db:seed --verbose
```

## 📊 Seeding Summary

When you run the seeder, you'll see output like:

```
🌱 Starting database seeding...
✅ Database connection established
✅ Created admin user: admin@example.com
   Password: admin123456
✅ Created user user: user@example.com
✅ Created user user: test@example.com

📊 Seeding Summary:
   ✅ Created: 3 users
   ⏭️  Skipped: 0 users

🔐 Login Credentials:
   Admin: admin@example.com / admin123456
   User: user@example.com / user123456
   User: test@example.com / test123456

🎉 Database seeding completed successfully!

📝 Next Steps:
   1. Start the application: bun run dev
   2. Visit: http://localhost:3000
   3. Login with the credentials above
   4. Change default passwords after first login
```

## 🔄 Reset Database

To completely reset the database:

```bash
# Drop and recreate database
dropdb nextjs_starter
createdb nextjs_starter

# Run migrations
bun run db:migrate

# Seed again
bun run db:seed
```

## 📚 Additional Resources

- [Drizzle ORM Seeding](https://orm.drizzle.team/docs/seed)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [UUID Documentation](https://www.npmjs.com/package/uuid)

## 🤝 Contributing

When modifying the seeder:

1. **Test all environments** (local, Docker, production)
2. **Update documentation** with new users
3. **Validate security** of default credentials
4. **Add proper error handling**
5. **Update environment variables** if needed

---

⚠️ **Warning**: Never use default passwords in production environments. Always change them immediately after deployment.