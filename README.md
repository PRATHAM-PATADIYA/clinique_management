# Clinic Queue Management System - Frontend

A complete React-based frontend application for managing clinic operations including appointments, queues, prescriptions, and user management.

## Overview

This is a full-featured clinic management system with role-based access control. The application supports four user roles:
- **Patient**: Book appointments, view prescriptions and medical reports
- **Doctor**: View patient queue, add prescriptions and medical reports
- **Receptionist**: Manage daily patient queue and update appointment status
- **Admin**: Manage clinic users and view clinic information

## Quick Start

### Test Credentials
```
Email: 23010101198@darshan.ac.in
Password: password123
```

### Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Features

### Patient Features
- Book appointments with doctors
- View all personal appointments
- Access prescriptions and medical reports
- View detailed appointment information

### Doctor Features
- View today's patient queue
- Add prescriptions to appointments
- Add medical reports and diagnosis
- Track patient status

### Receptionist Features
- Manage daily patient queue
- Update patient status during visit
- View appointment schedules

### Admin Features
- View clinic information
- Manage all users
- Create new users with roles

## API Integration

Base URL: `https://cmsback.sampaarsh.cloud`

### Endpoints Used
- Authentication: `/auth/login`
- Appointments: `/appointments`, `/appointments/my`, `/appointments/{id}`
- Queue: `/queue`, `/doctor/queue`
- Prescriptions: `/prescriptions/{id}`, `/prescriptions/my`
- Reports: `/reports/{id}`, `/reports/my`
- Admin: `/admin/clinic`, `/admin/users`, `/admin/users`

## Build for Production

```bash
npm run build
```

## Resources

- API Docs: https://cmsback.sampaarsh.cloud/api-docs/
- Project Video: https://www.youtube.com/watch?v=qCU7-u7ujus
