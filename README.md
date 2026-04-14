# Student Management System

A full-stack academic management platform for managing students, departments, courses, and grades.

## Business Overview

This project helps academic teams centralize day-to-day operations in one system:

- Maintain student profiles and department assignments.
- Organize departments and their course mappings.
- Manage course catalog and course details.
- Assign and update grades per student/course.
- Provide authenticated access for secure operations.

## Core Modules

- Authentication: register, login, JWT-based access.
- Students: list, details, create, update, delete, and grade visibility.
- Departments: list, details, create, update, delete.
- Manage Courses per Department: assign/unassign department-course links.
- Courses: list, details, create, update, delete.
- Student Grades: assign/update grade per student for selected department/course.

## Tech Stack

### Backend

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + SQL Server
- ASP.NET Identity + JWT authentication
- AutoMapper
- Swagger/OpenAPI

### Frontend

- Angular 21
- RxJS
- Bootstrap + Bootstrap Icons

## Project Structure

- API Labs/API01: Backend API project
- FrontEnd: Angular frontend app

## Prerequisites

- .NET SDK 10.x
- Node.js 20+ and npm
- SQL Server (local or reachable instance)

## Configuration

### Backend config

File: API Labs/API01/appsettings.json

- Connection string key: DefaultConnection
- JWT settings: Jwt:Key, Jwt:Issuer, Jwt:Audience

Default local connection currently configured:

Server=.;Database=ITI;Trusted_Connection=True;TrustServerCertificate=True;

### Frontend config

File: FrontEnd/src/environments/environment.ts

- baseUrl should point to backend API base:
  - http://localhost:5218/api

## How to Run

### 1) Run Backend API

```powershell
cd "API Labs/API01"
dotnet restore
# Optional first-time setup:
# dotnet ef database update
dotnet run --launch-profile http
```

Backend URLs:

- API base: http://localhost:5218/api
- Swagger UI: http://localhost:5218/swagger

Note: opening http://localhost:5218/ redirects to Swagger.

### 2) Run Frontend

```powershell
cd "FrontEnd"
npm install
npm start
```

Frontend URL:

- http://localhost:4200

## Default Login

On startup, backend seeds an admin account automatically:

- Username: admin
- Password: Admin123!

You can also create users from the Register page.

## Typical Business Flow

1. Login.
2. Add departments.
3. Manage department-course assignments.
4. Add students and link them to departments.
5. Open Student Grades and assign/update grades.
6. Review student records including grade data.

## Build Commands

### Backend

```powershell
cd "API Labs/API01"
dotnet build
```

### Frontend

```powershell
cd "FrontEnd"
npm run build
```

## Troubleshooting

- 401 Unauthorized: user is not logged in or token expired.
- 403 Forbidden: account lacks required permission for that endpoint.
- API unreachable from frontend: verify backend is running on port 5218 and environment baseUrl matches.
- CORS issues: ensure backend starts successfully and uses configured CORS policy.

## Notes

This repository contains both backend and frontend so you can run locally with two terminals (API and Angular app) for full end-to-end testing.
