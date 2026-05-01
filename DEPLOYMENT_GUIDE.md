# Railway Deployment Guide

## Prerequisites
- GitHub account (create one at https://github.com)
- Railway account (sign up at https://railway.app)
- Git installed locally

## Step 1: Prepare Your Code

1. Navigate to your project directory:
   ```bash
   cd d:\AuthService-main
   ```

2. Verify your git status:
   ```bash
   git status
   ```

## Step 2: Create a GitHub Repository

### Option A: Create via GitHub Web (Recommended for first time)
1. Go to https://github.com/new
2. Repository name: `TaskFlow` (or your preferred name)
3. Description: `Project Management Application`
4. Choose Public or Private
5. Initialize with README if you like (skip if using our README.md)
6. Click "Create repository"

### Option B: Using Git Command Line
```bash
git init
git add .
git commit -m "Initial commit: TaskFlow project management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 3: Configure Railway Project

### 3.1 Create Railway Account & Project
1. Go to https://railway.app and sign up
2. Create a new project
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your TaskFlow repository
6. Railway should detect the root `Dockerfile`

### 3.2 Configure Environment Variables

Railway will need these environment variables for the single app service:

```
DATABASE_URL=mysql://user:password@host:port/database
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CORS_ORIGINS=https://your-railway-app.up.railway.app
PORT=8080
```

### 3.3 Database Setup

Railway provides MySQL as a plugin:

1. In your Railway project dashboard:
   - Click "Add Service"
   - Select "MySQL"
   - Railway will create a MySQL instance

2. Railway will provide:
   - `MYSQLHOST` - Database host
   - `MYSQLPORT` - Database port (usually 3306)
   - `MYSQLUSER` - Database user
   - `MYSQLPASSWORD` - Database password
   - `MYSQLDATABASE` - Database name

4. Use these in your Railway app variables:
   ```
   DATABASE_URL=mysql://MYSQLUSER:MYSQLPASSWORD@MYSQLHOST:MYSQLPORT/MYSQLDATABASE
   ```

## Step 4: Deployment Process

### Automatic Deployment
1. Push code to GitHub main branch
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Railway will automatically:
   - Detect the push
   - Build your backend (runs `mvn clean package`)
   - Build your frontend (runs `npm install && npm run build`)
   - Deploy both services
   - Assign public URLs

### Manual Deployment
If automatic deployment doesn't work:
1. Go to your Railway project
2. Click "Deploy" button
3. Select the services to deploy
4. Monitor the deployment logs

## Step 5: Verify Deployment

1. **Check Backend Health**:
   ```
   https://your-backend-url.railway.app/api/profile
   ```

2. **Access Frontend**:
   ```
   https://your-frontend-url.railway.app
   ```

3. **Test Login**:
   - Email: `admin@taskflow.com`
   - Password: `admin123`

4. **View Logs**:
   - In Railway dashboard, click on service
   - Go to "Deployments" tab
   - Click on latest deployment
   - View real-time logs

## Step 6: Troubleshooting

### Backend Won't Start
```bash
# Check logs in Railway dashboard
# Common issues:
# 1. JWT_SECRET not set or too short (min 32 chars)
# 2. DATABASE_URL incorrect
# 3. Port already in use (Railway handles this)
```

### Frontend Build Fails
```bash
# Check package.json for correct scripts
# Ensure all dependencies are listed
# Run locally first: npm install && npm run build
```

### CORS Errors
1. Ensure `CORS_ORIGINS` in backend matches frontend URL
2. Update `VITE_API_BASE_URL` in frontend to match backend URL
3. Redeploy both services

### Database Connection Issues
1. Verify DATABASE_URL format:
   ```
   mysql://user:password@host:port/database
   ```
2. Check if MySQL service is running in Railway
3. Verify credentials in Railway dashboard

## Step 7: Domain Configuration (Optional)

To use a custom domain:
1. In Railway dashboard, go to project settings
2. Under "Domain" section
3. Add your custom domain
4. Follow Railway's DNS configuration instructions

## Step 8: Monitor Your Deployment

1. **View Logs**:
   - Railway dashboard → Service → Deployments → Logs

2. **Monitor Performance**:
   - Railway dashboard → Analytics tab

3. **Set Up Alerts** (Optional):
   - Railway dashboard → Settings → Alerts

## Important Notes

⚠️ **Security**:
- Change default admin password after first deployment
- Use a strong JWT_SECRET (minimum 32 characters)
- Keep database credentials secret
- Never commit `.env` files to GitHub
- Use Railway's encrypted environment variables

🔄 **CI/CD**:
- Every push to main branch triggers auto-deployment
- Deployments take 5-10 minutes typically
- Monitor logs for any failures

📦 **Scaling**:
- Use Railway dashboard to scale resources
- Adjust RAM/CPU as needed
- Database scaling handled by Railway

## Getting Your URLs

After deployment completes:

1. **Backend URL**: Check Railway dashboard → Backend service → "Connect" tab
   - Format: `https://xxx-production.up.railway.app`

2. **Frontend URL**: Check Railway dashboard → Frontend service → "Connect" tab
   - Format: `https://xxx-production.up.railway.app`

3. **API Base URL**: Backend URL + `/api`
   - Format: `https://xxx-production.up.railway.app/api`

## Rollback (If Needed)

If a deployment has issues:
1. Go to Railway dashboard → Service → Deployments
2. Click on the previous successful deployment
3. Click "Redeploy"
4. Railway will restore to that version

## Final Checklist

- [ ] GitHub repository created and code pushed
- [ ] Railway account created
- [ ] MySQL plugin added to Railway project
- [ ] All environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL`
  - [ ] `VITE_API_BASE_URL`
- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] Tested login with admin@taskflow.com / admin123
- [ ] Created projects and tasks in live environment
- [ ] Noted down live URLs for submission

## Support

- Railway Docs: https://docs.railway.app
- Railway Community: https://railway.app/community
- GitHub: Push to main to trigger auto-deployment

---

**Your Application is Now Live! 🚀**
