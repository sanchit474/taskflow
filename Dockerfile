FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/.mvn .mvn
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline
COPY backend/src ./src
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=backend-build /app/backend/target/AuthService-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8080

CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=prod -Dspring.datasource.url=${DATABASE_URL} -Dspring.datasource.username=${DATABASE_USER} -Dspring.datasource.password=${DATABASE_PASSWORD} -Djwt.secret.key=${JWT_SECRET} -Dspring.web.cors.allowed-origins=${CORS_ORIGINS:-*} -jar app.jar"]