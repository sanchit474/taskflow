FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/.mvn .mvn
RUN mvn dependency:go-offline
COPY backend/src src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy backend jar
COPY --from=backend-build /app/backend/target/AuthService-0.0.1-SNAPSHOT.jar ./backend.jar

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend

# Install node and serve for frontend
RUN apt-get update && apt-get install -y nodejs npm && npm install -g serve

# Expose ports
EXPOSE 8080 3000

# Create startup script
RUN echo '#!/bin/bash\n\
java -Dspring.profiles.active=prod \
     -Dspring.datasource.url=${DATABASE_URL} \
     -Dspring.datasource.username=${DATABASE_USER} \
     -Dspring.datasource.password=${DATABASE_PASSWORD} \
     -Djwt.secret.key=${JWT_SECRET} \
     -Dspring.web.cors.allowed-origins=${CORS_ORIGINS} \
     -Dserver.port=8080 \
     -jar backend.jar & \
serve -s frontend -l 3000' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
