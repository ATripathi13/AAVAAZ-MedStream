# AAVAAZ MedStream Backend (Django)

Real-time speech transcription service with WebSocket support.

## Setup

1. Install dependencies:
```bash
python -m pip install -r requirements.txt
```

2. Run migrations (if needed):
```bash
python manage.py migrate
```

3. Run server:
```bash
daphne -b 0.0.0.0 -p 8000 medstream.asgi:application
```

Or use Django's development server with Channels:
```bash
python manage.py runserver 8000
```

## WebSocket Endpoint

- **URL**: `ws://localhost:8000/ws/transcribe/`
- **Purpose**: Real-time audio streaming and transcription

## Features

- Real-time audio chunk processing
- ASR simulation (replace with actual service in production)
- Patient name extraction from transcription
- Integration with Node.js Patient Service API
- Automated summary document generation
