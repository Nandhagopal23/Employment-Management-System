# EMS Backend Server

## Overview
This is the backend for the Employee Management System, built with Node.js, Express, and Sequelize (SQLite for dev).

## Enterprise Architecture
The project follows a strict layered architecture:
- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain business logic and validation.
- **Repositories**: Handle direct database interactions.
- **Models**: Define Database Schema (Sequelize).

## Prerequisites
- Node.js installed

## Setup
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Seed the database (Initializes SQLite and adds mock data):
    ```bash
    npm run seed
    ```

## Running the Server
```bash
npm start
```
Server runs on `http://localhost:5000`.

## API Endpoints

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/search?q=Name` - Search employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
