# 🚀 Deployment Guide - Capstone Wool Store

This guide provides comprehensive instructions for deploying your Capstone Wool Store application to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git repository
- Domain name (for production)

## 🛠️ Pre-Deployment Setup

### 1. Environment Configuration

Create `.env.production` file:
```bash
cp .env.example .env.production
```

Update the production environment variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capstone-wool-store
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here
```

### 2. Build and Test

```bash
# Install dependencies
npm install

# Run tests
npm run test:ci

# Build for production
npm run build

# Test production build locally
npm run start
```

## 🐳 Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Setup Environment**:
```bash
# Copy environment file
cp .env.example .env.production

# Update MongoDB connection for Docker
MONGODB_URI=mongodb://admin:password123@mongodb:27017/capstone-wool-store?authSource=admin
```

2. **Deploy with Docker Compose**:
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

3. **Initialize Database**:
```bash
# Run seed script in Docker container
docker-compose exec app npm run seed
```

### Option 2: Docker Only

```bash
# Build image
docker build -t wool-store .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e NEXTAUTH_SECRET="your-secret" \
  wool-store
```

## ☁️ Cloud Platform Deployment

### Vercel (Recommended for Next.js)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

3. **Environment Variables**:
   - Go to Vercel Dashboard
   - Add environment variables from `.env.example`
   - Redeploy

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add from `.env.example`

### Railway

1. **Connect Repository**:
   - Connect your GitHub repository
   - Select the main branch

2. **Environment Variables**:
   - Add all variables from `.env.example`
   - Set `PORT=3000`

3. **Deploy**:
   - Railway will auto-deploy on push to main

### AWS (EC2 + MongoDB Atlas)

1. **Setup EC2 Instance**:
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Deploy Application**:
```bash
# Clone repository
git clone https://github.com/your-username/capstone-project.git
cd capstone-project

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "wool-store" -- start
pm2 save
pm2 startup
```

3. **Setup Reverse Proxy (Nginx)**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster
   - Setup database user
   - Whitelist IP addresses

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Update `MONGODB_URI` in your environment

3. **Initialize Data**:
```bash
# Run seed script
npm run seed
```

### Local MongoDB

```bash
# Install MongoDB
# For Ubuntu:
sudo apt-get install mongodb

# For macOS:
brew install mongodb-community

# Start MongoDB
mongod

# Run seed script
npm run seed
```

## 🔒 Security Configuration

### SSL/TLS Setup

1. **Get SSL Certificate**:
   - Use Let's Encrypt for free certificates
   - Or use your cloud provider's SSL

2. **Update Environment**:
```env
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### Security Headers

Security headers are already configured in `next.config.mjs`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## 📊 Monitoring and Maintenance

### Health Checks

Create a health check endpoint:
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
}
```

### Logging

```bash
# View application logs
pm2 logs wool-store

# View Docker logs
docker-compose logs -f app
```

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=backup/

# Restore
mongorestore --uri="your-mongodb-uri" backup/
```

## 🚀 Performance Optimization

### Production Optimizations Already Enabled

- **Next.js standalone output** for smaller Docker images
- **Image optimization** for external images
- **Compression** enabled
- **Security headers** configured

### Additional Optimizations

1. **CDN Setup**:
   - Use Cloudflare or AWS CloudFront
   - Cache static assets

2. **Database Optimization**:
   - Indexes are created automatically
   - Connection pooling enabled

3. **Monitoring**:
   - Add error tracking (Sentry)
   - Performance monitoring (New Relic)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run test:ci`)
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate obtained
- [ ] Domain DNS configured

### Post-Deployment
- [ ] Application accessible via domain
- [ ] Database seeded with initial data
- [ ] Admin account created
- [ ] SSL working correctly
- [ ] All features tested in production
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check connection string
   - Verify network access
   - Ensure database exists

2. **Build Failures**:
   - Clear cache: `rm -rf .next`
   - Update dependencies: `npm update`
   - Check Node.js version

3. **Environment Variables**:
   - Verify all required variables are set
   - Check variable names (case-sensitive)
   - Restart application after changes

### Getting Help

- Check application logs
- Review error messages
- Test locally first
- Check MongoDB connection
- Verify environment variables

## 📞 Support

For deployment support:
- Review this documentation
- Check GitHub issues
- Test with provided demo credentials:
  - Admin: `admin@woolstore.com` / `admin123`  
  - Customer: `test@example.com` / `password123`

---

## Quick Start Commands

```bash
# Development
npm run dev

# Production Build
npm run deploy:build

# Docker Deployment
docker-compose up -d

# Database Seeding
npm run seed

# Test Everything
npm run test:ci
```

Your Capstone Wool Store is now ready for production deployment! 🎉