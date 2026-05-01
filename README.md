# TaskFlow - Project Management Application

A full-stack project management application with authentication, role-based access control, and team collaboration features.

## Features

- **User Authentication**: JWT-based authentication with signup/login
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Project Management**: Create, manage, and collaborate on projects
- **Task Management**: Create tasks, assign team members, track progress with Kanban board
- **Team Management**: Admin can manage team members and assign roles
- **Dashboard**: Overview of tasks, projects, and team statistics
- **Responsive UI**: Modern, responsive design with Bootstrap 5

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Database**: MySQL (TiDB Cloud)
- **Security**: Spring Security with JWT (jjwt 0.12.5)
- **ORM**: Spring Data JPA + Hibernate
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **UI Library**: Bootstrap 5
- **Styling**: Custom CSS with Grid layouts

## Project Structure

```
AuthService-main/
├── backend/
│   ├── src/main/java/com/AuthService/
│   │   ├── config/          # Security, JWT configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access layer
│   │   ├── entity/          # JPA entities
│   │   ├── io/              # DTOs (Request/Response)
│   │   └── custom/          # Custom components
│   ├── pom.xml              # Maven dependencies
│   └── mvnw                 # Maven wrapper
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── component/       # Reusable components
│   │   ├── context/         # React Context
│   │   ├── assets/          # Images, icons
│   │   └── App.jsx          # Root component
│   ├── package.json         # npm dependencies
│   └── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- npm 9 or higher
- MySQL 8 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuthService-main
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Update application.properties with your database credentials
   nano src/main/resources/application.properties
   # Build and run
   mvn clean compile
   java -jar target/AuthService-0.0.1-SNAPSHOT.jar
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/your-db-name
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=create-drop
jwt.secret.key=your-jwt-secret-key
jwt.expiration.time=86400000
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Default Admin Account

On first startup, the application creates a default admin account:
- **Email**: admin@taskflow.com
- **Password**: admin123
- **Role**: ADMIN

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new member
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/members` - Add member to project
- `DELETE /api/projects/{id}/members/{memberId}` - Remove member from project

### Tasks
- `GET /api/tasks/project/{projectId}` - List tasks in project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PUT /api/tasks/{id}/status` - Update task status
- `PUT /api/tasks/{id}/assign` - Assign task to member
- `DELETE /api/tasks/{id}` - Delete task

### Dashboard
- `GET /api/dashboard/tasks-by-status` - Get task statistics
- `GET /api/dashboard/overdue-tasks` - Get overdue tasks

### Team Management
- `GET /api/users/members` - List all members
- `POST /api/users` - Add new member (Admin only)
- `DELETE /api/users/{id}` - Delete member (Admin only)

## User Roles

### ADMIN
- Full access to all features
- Can manage team members
- Can view all projects and tasks
- Can delete projects

### MEMBER
- Can create and manage own projects
- Can collaborate on assigned projects
- Can create and manage tasks
- Cannot access team management

## Deployment

### Deploy to Railway

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app) and sign up

2. **Connect GitHub Repository**
   - Push this repository to GitHub
   - Create a new Railway project from the GitHub repo

3. **Use the root Dockerfile**
   - Railway should detect the root `Dockerfile`
   - It builds the React app, bundles it into Spring Boot, and runs one live service

4. **Set Environment Variables**
   - `DATABASE_URL`
   - `DATABASE_USER`
   - `DATABASE_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ORIGINS`

5. **Deploy**
   - Railway will build and deploy the app automatically

## Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Frontend
```bash
cd frontend
npm run build
```

## Testing

### Manual Testing with Postman
1. Import the API collection
2. Use the default admin account to login
3. Test all CRUD operations

## Troubleshooting

### Backend Issues
- **JWT Secret Error**: Ensure `jwt.secret.key` is set in application.properties
- **Database Connection**: Verify MySQL is running and credentials are correct
- **Port Conflicts**: Backend runs on port 8080 by default

### Frontend Issues
- **CORS Errors**: Check if backend CORS is configured correctly
- **Build Errors**: Run `npm install` to ensure all dependencies are installed
- **Port Already in Use**: Frontend runs on port 5173 by default

## Security

- All passwords are hashed using Spring Security's BCryptPasswordEncoder
- JWT tokens are signed with HMAC SHA256
- CORS is configured to allow only trusted origins
- Method-level security with @PreAuthorize annotations
- CSRF protection enabled

## Future Enhancements

- Email verification
- Password reset functionality
- Project templates
- Task attachments
- Real-time notifications
- Activity logging
- Advanced analytics

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please contact the development team.

---

**Made with ❤️ using Spring Boot, React, and Railway**
