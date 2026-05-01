FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

RUN mvn dependency:go-offline

COPY src src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/AuthService-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]