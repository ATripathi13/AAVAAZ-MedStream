# AAVAAZ MedStream Backend (Node.js)

Patient management service with REST API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Create Patient
- **POST** `/api/patients`
- **Body**:
```json
{
  "name": "John Doe",
  "date_of_birth": "1990-01-01",
  "phone": "555-1234",
  "address": "123 Main St",
  "diagnosis": "Hypertension"
}
```

### Search Patients
- **GET** `/api/patients/search?name=John`
- Returns array of matching patients

### Get All Patients
- **GET** `/api/patients`
- Returns all patients ordered by creation date

### Health Check
- **GET** `/health`
- Returns server status

## Database

Uses SQLite (`patients.db`) for local development and portability.
