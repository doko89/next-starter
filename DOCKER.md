# Docker Setup Guide

This guide covers the Docker setup for the Next.js Authentication System with PostgreSQL and Redis.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Nginx      │────│   Next.js App   │────│     Redis       │
│  (Load Balancer │    │  (Bun Runtime)  │    │    (Cache)      │
│   & Proxy)      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │    (Database)   │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Bun** (for local development)

## 🚀 Quick Start

### 1. Using the Setup Script (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd nextjs-starter

# Start development environment
./docker-setup.sh dev

# Create admin user (optional)
./docker-setup.sh admin

# Check application health
./docker-setup.sh health
```

### 2. Manual Setup

```bash
# Copy environment file
cp .env.docker .env

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
docker-compose -f docker-compose.dev.yml exec app bun run db:migrate

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🐳 Docker Compose Files

### Development (`docker-compose.dev.yml`)
- **Next.js App**: Running in development mode with hot reload
- **PostgreSQL**: Development database
- **Redis**: Development cache
- **Volumes**: Live code mounting

### Production (`docker-compose.yml`)
- **Next.js App**: Production build with Nginx proxy
- **PostgreSQL**: Production database
- **Redis**: Production cache
- **Nginx**: Load balancer and reverse proxy
- **Health Checks**: All services have health checks

## 🗂️ Project Structure

```
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── docker-setup.sh             # Setup and management script
├── Dockerfile                  # Multi-stage build for Next.js
├── docker/
│   ├── nginx/
│   │   └── nginx.conf          # Nginx configuration
│   └── postgres/
│       └── init.sql            # Database initialization
├── .env.docker                 # Docker environment template
└── public/uploads/             # File upload directory
```

## 🔧 Configuration

### Environment Variables

#### Database
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nextjs_starter
```

#### Redis
```env
REDIS_URL=redis://redis:6379
```

#### NextAuth
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_TRUST_HOST=true
```

#### Google OAuth
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Docker Health Checks

- **Application**: `/api/health` endpoint
- **Database**: `pg_isready` command
- **Redis**: `redis-cli ping` command

### Nginx Configuration

Features:
- **Rate Limiting**: API endpoints rate-limited
- **File Uploads**: 5MB limit for avatar uploads
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **Gzip Compression**: Automatic compression for static assets
- **Static File Serving**: Direct serving of uploaded files

## 📊 Monitoring & Health Checks

### Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "filesystem": "connected"
  },
  "environment": "production",
  "memory": {
    "used": 128,
    "total": 256,
    "percentage": 50
  }
}
```

### Container Status

```bash
./docker-setup.sh status
```

### Logs

```bash
./docker-setup.sh logs
```

## 🗃️ Database Management

### Migrations

```bash
# Run migrations
./docker-setup.sh migrate

# Or manually
docker-compose exec app bun run db:migrate
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d nextjs_starter

# View tables
\dt

# View users
SELECT * FROM users;
```

### Creating Admin User

```bash
./docker-setup.sh admin
```

Default credentials:
- **Email**: admin@example.com
- **Password**: admin123

## 🚀 Deployment

### Production Deployment

```bash
# Build and start production environment
./docker-setup.sh prod

# Check health
./docker-setup.sh health
```

### Scaling

```bash
# Scale the application
docker-compose -f docker-compose.yml up -d --scale app=3

# Scale with load balancer
docker-compose -f docker-compose.yml up -d --scale nginx=2
```

### Volume Management

```bash
# List volumes
docker volume ls

# Backup database
docker-compose exec postgres pg_dump -U postgres nextjs_starter > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres nextjs_starter < backup.sql
```

## 🔒 Security

### Security Features

- **Non-root User**: Application runs as non-root user
- **Rate Limiting**: API endpoints rate-limited
- **Security Headers**: OWASP recommended headers
- **File Validation**: Upload file type and size validation
- **Environment Variables**: Sensitive data in environment variables
- **Network Isolation**: Docker network isolation

### Security Best Practices

1. **Change Default Passwords**
   ```bash
   ./docker-setup.sh admin
   # Login and change password immediately
   ```

2. **Update Secrets**
   ```bash
   # Generate new secret
   openssl rand -base64 32
   ```

3. **Use HTTPS in Production**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

4. **Regular Updates**
   ```bash
   # Update Docker images
   docker-compose pull
   docker-compose up -d
   ```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
docker-compose exec postgres pg_isready -U postgres

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### 2. Redis Connection Failed
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Check logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

#### 3. Application Not Starting
```bash
# Check application logs
docker-compose logs app

# Check health endpoint
curl http://localhost:3000/api/health

# Rebuild application
docker-compose build --no-cache app
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER public/uploads

# Check user permissions
docker-compose exec app whoami
```

### Debug Mode

```bash
# Enable debug logging
docker-compose -f docker-compose.dev.yml up -d

# View real-time logs
docker-compose logs -f
```

### Performance Monitoring

```bash
# Check resource usage
docker stats

# Check container health
docker-compose ps

# Monitor database
docker-compose exec postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

## 🔄 Maintenance

### Regular Tasks

```bash
# Clean up unused images
docker image prune -f

# Clean up unused volumes
docker volume prune -f

# Update application
git pull
docker-compose build
docker-compose up -d

# Backup database
./backup-database.sh
```

### Log Management

```bash
# Rotate logs
docker-compose logs --tail=100

# Export logs
docker-compose logs > app.log

# Clear logs
docker system prune -f
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)

## 🤝 Contributing

When contributing to the Docker setup:

1. Test changes with both dev and prod configurations
2. Update documentation
3. Add health checks for new services
4. Test on different platforms (Linux, macOS, Windows)
5. Verify security best practices

## 📞 Support

If you encounter issues:

1. Check the logs: `./docker-setup.sh logs`
2. Verify health: `./docker-setup.sh health`
3. Check status: `./docker-setup.sh status`
4. Review troubleshooting section
5. Create an issue with detailed logs