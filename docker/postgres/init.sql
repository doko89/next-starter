-- Initialize database for Next.js Authentication System

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database if it doesn't exist
-- This is handled by POSTGRES_DB environment variable

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verificationTokens(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verificationTokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verificationTokens(expires);

-- Set timezone
SET timezone = 'UTC';

-- Create default admin user (optional)
-- This should be done through the application interface
-- INSERT INTO users (id, name, email, role, created_at, updated_at)
-- VALUES (uuid_generate_v4(), 'Admin User', 'admin@example.com', 'admin', NOW(), NOW());

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;