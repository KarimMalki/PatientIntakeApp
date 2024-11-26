# Patient Intake System

A full-stack web application for managing patient intake, appointments, and medical records. Built with React, Node.js, Express, SQLite3, and Tailwind CSS.

## Features

- User Authentication (Admin/Staff)
- Patient Registration
- Appointment Scheduling
- Doctor Management
- Admin Dashboard
- Patient Records Management

## Project Structure

```
patient-intake-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── database.js       # Database configuration
│   ├── server.js         # Express server
│   └── package.json
└── database/             # SQLite database files
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd patient-intake-app/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd patient-intake-app/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your default browser at http://localhost:3000

### Initial Admin User Setup

To create an initial admin user, you can use the following SQL command in the SQLite database:

```sql
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin');
```

Default login credentials:
- Username: admin
- Password: admin123

## Database Schema

### Users Table
- id (Primary Key)
- username
- password (hashed)
- role
- created_at

### Doctors Table
- id (Primary Key)
- name
- specialization
- email
- phone
- created_at

### Patients Table
- id (Primary Key)
- name
- email
- phone
- date_of_birth
- address
- medical_history
- created_at

### Appointments Table
- id (Primary Key)
- patient_id (Foreign Key)
- doctor_id (Foreign Key)
- date
- time
- description
- status
- created_at

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Role-based access control

## Technologies Used

- Frontend:
  - React
  - React Router
  - Tailwind CSS
  - Axios
  - date-fns

- Backend:
  - Node.js
  - Express
  - SQLite3
  - JSON Web Tokens
  - bcrypt

## License

MIT License
