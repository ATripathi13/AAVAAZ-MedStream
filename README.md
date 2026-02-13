# AAVAAZ MedStream

[![Production Ready](https://img.shields.io/badge/status-production--ready-green)]()

A lightweight real-time healthcare prototype system featuring patient management, live speech transcription, and contextual summary generation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

## 🎯 System Overview

AAVAAZ MedStream demonstrates a complete healthcare workflow:
1. **Create patient records** with diagnosis information
2. **Record live speech** via microphone
3. **Stream audio to backend** in real-time
4. **Receive live transcription** updates
5. **Detect referenced patient** from transcription
6. **Generate structured summary** document
7. **Display results** on the frontend

## 🏗️ Architecture

```
React Frontend (Vite + Tailwind CSS)
         ↓
Node.js REST API (Express + SQLite) ← Patient Records
         ↓
Django WebSocket Server (Channels)
         ↓
ASR Service (Simulated/Real-time)
         ↓
Post-Processing → Summary Generator
         ↓
WebSocket Response → Frontend Display
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Web Audio API** for microphone access
- **WebSocket** client for real-time communication

### Backend (Node.js - Patient Service)
- **Node.js** with Express
- **SQLite** database
- **REST API** for patient CRUD operations

### Backend (Django - Real-Time Pipeline)
- **Django 5.0** with Channels
- **WebSockets** for bi-directional communication
- **Simulated ASR** (extensible to ElevenLabs, AWS Transcribe, etc.)
- **Patient Detection** via NLP pattern matching
- **Summary Generation** with contextual data

## 📁 Project Structure

```
aavaaz-medstream/
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Layout, shared components
│   │   ├── pages/         # Home, Patient Creation, Transcription
│   │   └── index.css      # Global styles + Tailwind
│   └── package.json
│
├── backend-node/          # Patient service API
│   ├── server.js          # Express app with SQLite
│   ├── patients.db        # SQLite database (auto-created)
│   └── package.json
│
├── backend-django/        # Real-time transcription service
│   ├── medstream/         # Django project settings
│   ├── transcription/     # WebSocket consumer app
│   │   ├── consumers.py   # ASR + summary logic
│   │   └── routing.py     # WebSocket URL routing
│   ├── manage.py
│   └── requirements.txt
│
└── Screenshots/           # UI design references
```

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.10+
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/ATripathi13/AAVAAZ-MedStream.git
cd AAVAAZ-MedStream
```

### 2. Setup Node.js Backend (Patient Service)

```bash
cd backend-node
npm install
npm start
```

Backend runs on: `http://localhost:3000`

### 3. Setup Django Backend (WebSocket Service)

```bash
cd backend-django
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Backend runs on: `http://localhost:8000`

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📡 API Endpoints

### Node.js (Patient Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients` | Create new patient |
| GET | `/api/patients/search?name=...` | Search patients by name |
| GET | `/api/patients` | Get all patients |
| GET | `/health` | Health check |

### Django (WebSocket)

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| WebSocket | `/ws/transcribe/` | Real-time audio streaming |

## 🎥 How to Demo

1. **Start all three services** (Node.js, Django, Frontend)

2. **Create a patient**:
   - Navigate to "Patient Creation"
   - Fill in patient details (e.g., Name: "John", Diagnosis: "Diabetes")
   - Submit

3. **Record speech**:
   - Navigate to "Speech Transcription"
   - Click "START RECORDING"
   - Speak: *"This consultation is for John. Patient presents with elevated blood sugar levels. Recommend starting medication and follow-up in two weeks."*
   - Click "STOP RECORDING"

4. **View results**:
   - See live transcription during recording
   - After stopping, view patient details retrieved from database
   - See generated summary document combining transcription + patient data

## 🌟 Key Features

- ✅ **Real-time audio streaming** via WebSocket
- ✅ **Live transcription** updates (simulated ASR)
- ✅ **Patient detection** from speech content
- ✅ **Database integration** for patient records
- ✅ **Contextual summary** generation
- ✅ **Premium UI/UX** matching design specifications
- ✅ **Production-ready structure** with clean architecture

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:8000
```

### Using Real ASR Service

To replace the ASR simulation in `backend-django/transcription/consumers.py`:

1. Install ASR SDK (e.g., `pip install elevenlabs`)
2. Replace `simulate_asr()` method with actual API call
3. Update audio format handling as needed

## 🧪 Testing

### Manual Testing

1. **Patient Creation**: Submit form, verify database record
2. **Patient Search**: Create patient, search by name
3. **WebSocket Connection**: Check browser console for connection logs
4. **Transcription**: Verify live text updates during recording
5. **Summary Generation**: Confirm patient details + summary display

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Node.js)
- Can be deployed to any Node.js hosting (Heroku, Railway, Render)
- Update database to PostgreSQL/MySQL for production

### Backend (Django)
- Use Daphne or Uvicorn for ASGI server
- Configure Redis for Channel Layers in production
- Deploy to services supporting WebSockets (Render, Railway)

## 📋 Assumptions & Decisions

1. **ASR Simulation**: Real ASR requires API keys and costs. Implemented realistic simulation for demonstration.
2. **SQLite Database**: Used for portability. Replace with PostgreSQL/MySQL for production.
3. **In-Memory Channel Layer**: For local dev. Use Redis in production for distributed systems.
4. **Simple Patient Detection**: Pattern matching for demo. Can be enhanced with NLP libraries (spaCy, NLTK).
5. **No Authentication**: Focus on core functionality. Add JWT/OAuth for production.

## 🐛 Troubleshooting

**WebSocket connection fails**:
- Ensure Django backend is running on port 8000
- Check browser console for errors
- Verify CORS settings

**Microphone access denied**:
- Allow browser microphone permissions
- Use HTTPS in production (required for getUserMedia)

**Patient not found in summary**:
- Ensure patient name is clearly mentioned in speech
- Check pattern matching in `consumers.py`
- Create patient before recording

## 📄 License

MIT

## 👤 Author

Built as a healthcare workflow prototype demonstrating real-time audio processing and patient data integration.

---

**Note**: This is a prototype system. For production use, implement proper authentication, data encryption, HIPAA compliance, and use production-grade ASR services.