# Quick Start Guide - Local Development & Docker

## Local Development (Without Docker)

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+

### Backend Setup
```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# Then run:
mvn clean compile
java -jar target/AuthService-0.0.1-SNAPSHOT.jar
```

Backend runs at: `http://localhost:8080/api`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Docker Compose Setup (Recommended for Testing)

This setup includes MySQL, Backend, and Frontend all running in containers.

### Prerequisites
- Docker Desktop installed
- 4GB RAM available

### Steps

1. **Navigate to project root**:
   ```bash
   cd d:\AuthService-main
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to start** (~2-3 minutes):
   ```bash
   docker-compose logs -f
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:3000 (or http://localhost:5173)
   - **Backend API**: http://localhost:8080/api
   - **MySQL**: localhost:3306

5. **Default login credentials**:
   - **Email**: admin@taskflow.com
   - **Password**: admin123

### Common Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Stop all services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Remove everything including volumes
docker-compose down -v

# Restart a service
docker-compose restart backend
```

### Troubleshooting Docker

**Port already in use**:
```bash
# Change ports in docker-compose.yml
# Then restart
docker-compose down
docker-compose up -d
```

**MySQL won't connect**:
```bash
# Check MySQL health
docker-compose ps
# Restart MySQL
docker-compose restart mysql
```

**Frontend not loading**:
```bash
# Rebuild frontend
docker-compose down
docker-compose build frontend
docker-compose up -d
```

---

## Building Docker Images for Production

### Build all images
```bash
docker build -f Dockerfile.backend -t taskflow-backend:latest .
docker build -f Dockerfile.frontend -t taskflow-frontend:latest .
```

### Push to Registry (Optional)
```bash
# Docker Hub (requires account)
docker tag taskflow-backend:latest YOUR_USERNAME/taskflow-backend:latest
docker push YOUR_USERNAME/taskflow-backend:latest

# Railway will handle this automatically
```

---

## Next Steps: Deploy to Railway

After testing locally with Docker Compose:

1. **Commit your code**:
   ```bash
   git add .
   git commit -m "Add Docker and Railway configuration"
   git push origin main
   ```

2. **Follow the Railway Deployment Guide**:
   ```
   See DEPLOYMENT_GUIDE.md
   ```

---

## Environment Variables Reference

### Backend (.env or docker-compose)
- `DATABASE_URL`: MySQL connection string
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret (min 32 chars)
- `CORS_ORIGINS`: Comma-separated allowed origins
- `SERVER_PORT`: Server port (default 8080)

### Frontend (.env.local)
- `VITE_API_BASE_URL`: Backend API base URL

---

## Testing the APIs

### Using curl

**Login**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@taskflow.com",
    "password": "admin123"
  }'
```

**Get Projects** (with JWT token):
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Create new request
2. Method: POST
3. URL: `http://localhost:8080/api/auth/login`
4. Body (JSON):
   ```json
   {
     "email": "admin@taskflow.com",
     "password": "admin123"
   }
   ```
5. Copy the `accessToken` from response
6. Use it in Authorization header for other requests:
   ```
   Authorization: Bearer <YOUR_TOKEN>
   ```

---

## Performance Tips

- MySQL queries are logged (set `spring.jpa.show-sql=false` in prod)
- Frontend builds to optimized dist folder
- Images are multi-stage for smaller sizes
- Containers auto-restart on failure

---

For Railway deployment, see `DEPLOYMENT_GUIDE.md`
