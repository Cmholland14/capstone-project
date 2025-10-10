# 🔒 SECURITY.md - Security Guidelines and Best Practices

## 🚨 IMPORTANT SECURITY NOTICE

**Your Google OAuth credentials were found in `.env.local` and have been removed for security.**

## 🔧 IMMEDIATE ACTIONS REQUIRED

### 1. Rotate Google OAuth Credentials
The exposed credentials have been removed from `.env.local`. You need to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials
2. **Delete the compromised credentials**: 
   - Client ID: `[REDACTED - was 974499145092-...]`
   - Client Secret: `[REDACTED - was GOCSPX-...]`
3. **Create new OAuth 2.0 credentials**
4. **Update your `.env.local`** with the new credentials

### 2. Generate Secure Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET  
openssl rand -base64 32

# Generate MONGO_ROOT_PASSWORD
openssl rand -base64 24
```

## 📋 SECURITY CHECKLIST

### ✅ Environment Variables
- [ ] `.env.local` contains only placeholder values (no real secrets)
- [ ] `.env.production` is created but not committed to git
- [ ] All secrets use environment variables, not hardcoded values
- [ ] Generated secure random secrets for production

### ✅ Git Security
- [ ] `.env*` files are in `.gitignore`
- [ ] No secrets in commit history
- [ ] No API keys or passwords in source code
- [ ] No sensitive data in documentation

### ✅ Docker Security
- [ ] Docker environment variables use `${VAR:-default}` pattern
- [ ] No hardcoded passwords in docker-compose.yml
- [ ] Secrets are passed via environment files or Docker secrets

### ✅ Production Security
- [ ] HTTPS enabled in production
- [ ] Security headers configured (already done in next.config.mjs)
- [ ] Database authentication enabled
- [ ] Regular security audits performed

## 🛡️ SECURITY BEST PRACTICES

### 1. Environment Management
```bash
# Development
cp .env.example .env.local
# Edit .env.local with development values

# Production  
cp .env.example .env.production
# Edit .env.production with production values
```

### 2. Secret Generation
```bash
# For NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# For SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Docker Security
```bash
# Create .env file for Docker
echo "MONGO_ROOT_PASSWORD=$(openssl rand -base64 24)" > .env
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env

# Run with environment file
docker-compose --env-file .env up -d
```

## 🔍 SECURITY SCANNING

### Regular Security Checks
```bash
# Check for secrets in git history
git log --all --full-history -- .env*

# Scan for potential secrets in codebase
npm audit

# Check for hardcoded credentials
grep -r "password\|secret\|key" src/ --exclude-dir=node_modules
```

### Automated Security
Consider adding to your CI/CD:
- **GitGuardian** for secret detection
- **Snyk** for dependency vulnerabilities
- **ESLint security rules**
- **Pre-commit hooks** for secret scanning

## 📚 DEMO CREDENTIALS

The following are safe demo credentials for testing:
- **Admin**: `admin@woolstore.com` / `admin123`
- **Customer**: `test@example.com` / `password123`

These are:
- ✅ Only used in seed data for testing
- ✅ Clearly documented as demo credentials
- ✅ Hashed when stored in database
- ✅ Not real user accounts

## 🚫 WHAT NOT TO COMMIT

Never commit files containing:
- Real database connection strings
- API keys or tokens
- OAuth client secrets
- Production passwords
- Private keys or certificates
- User data or personal information

## ✅ CURRENT SECURITY STATUS

After following this guide:
- ✅ **No secrets in git repository**
- ✅ **Environment variables properly configured**
- ✅ **Docker security improved**
- ✅ **Security headers enabled**
- ✅ **Proper authentication implemented**

## 📞 INCIDENT RESPONSE

If you suspect a security breach:
1. **Rotate all credentials immediately**
2. **Check access logs for suspicious activity**
3. **Review git history for accidentally committed secrets**
4. **Update all affected systems**
5. **Document the incident**

## 🔄 REGULAR MAINTENANCE

- **Monthly**: Review and rotate secrets
- **Weekly**: Run security scans
- **Daily**: Monitor for security alerts
- **Each deployment**: Verify no secrets in new code

Remember: **Security is an ongoing process, not a one-time setup!**