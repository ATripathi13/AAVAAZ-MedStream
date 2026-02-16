import json
import asyncio
import re
from channels.generic.websocket import AsyncWebsocketConsumer
import requests

# Node.js API URL for patient search
NODE_API_URL = "http://localhost:3000"


class TranscriptionConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time speech transcription.
    Receives audio chunks, processes them, and sends back transcription.
    """

    # Dictionary mapping common diagnoses to predicted medicines
    MEDICINE_MAPPING = {
        "hypertension": "Amlodipine",
        "diabetes": "Metformin",
        "fever": "Dolo",
        "headache": "Paracetamol",
        "infection": "Amoxicillin",
        "asthma": "Albuterol",
        "anxiety": "Sertraline",
        "cough": "Cough Syrup",
        "cold": "Cetirizine",
    }

    async def connect(self):
        await self.accept()
        self.transcription_buffer = []
        self.audio_buffer = []
        self.current_patient = None
        
        # Pre-fetch the most recent patient to use for simulation
        try:
            self.current_patient = await self.fetch_most_recent_patient()
            if self.current_patient:
                print(f"Connected. Default patient for session: {self.current_patient.get('name')}")
        except Exception as e:
            print(f"Error pre-fetching patient: {e}")
            
        print("WebSocket connected")

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected: {close_code}")

    async def receive(self, text_data=None, bytes_data=None):
        """
        Receive audio chunks or control messages from frontend.
        """
        if text_data:
            # Handle control messages (e.g., stop recording)
            data = json.loads(text_data)
            if data.get('action') == 'stop':
                await self.process_final_transcription()
        
        elif bytes_data:
            # Handle audio chunk
            self.audio_buffer.append(bytes_data)
            
            # Simulate ASR processing
            # In production, this would call a real ASR service
            transcribed_text = await self.simulate_asr(bytes_data)
            
            if transcribed_text:
                self.transcription_buffer.append(transcribed_text)
                
                # Send partial transcription back to client
                await self.send(text_data=json.dumps({
                    'type': 'transcription',
                    'text': transcribed_text
                }))

    def predict_medicine(self, diagnosis):
        """
        Predict medicine based on diagnosis string.
        """
        if not diagnosis:
            return "Dolo"  # Default fallback
        
        diag_lower = diagnosis.lower()
        for key, medicine in self.MEDICINE_MAPPING.items():
            if key in diag_lower:
                return medicine
        
        return "Dolo"  # Default fallback if no match

    async def simulate_asr(self, audio_chunk):
        """
        Simulate ASR processing.
        In production, replace this with actual ASR service call.
        """
        # Simulate processing delay
        await asyncio.sleep(0.1)
        
        # Use current patient info if available, otherwise fallback to defaults
        patient_name = self.current_patient.get('name', 'John') if self.current_patient else 'John'
        diagnosis_text = self.current_patient.get('diagnosis', 'fever') if self.current_patient else 'fever'
        predicted_medicine = self.predict_medicine(diagnosis_text)

        # Generate simulated medical transcription using the requested format
        # Hi, I'm Dr. Smith, I saw patient John today who will take dolo .
        medical_phrases = [
            f"Hi, I'm Dr. Smith,",
            f"I saw patient {patient_name} today",
            f"who will take {predicted_medicine}."
        ]
        
        if len(self.transcription_buffer) < len(medical_phrases):
            return medical_phrases[len(self.transcription_buffer)]
        return ""

    async def process_final_transcription(self):
        """
        Process complete transcription when recording stops.
        Extract patient name, fetch patient details, and generate summary.
        """
        full_transcription = " ".join(self.transcription_buffer)
        
        # Extract patient name from transcription
        patient_name = self.extract_patient_name(full_transcription)
        
        # Fetch patient details from Node.js API
        patient_details = None
        if patient_name:
            patient_details = await self.fetch_patient_details(patient_name)
        
        # If no name was detected, or no specific patient found, use the pre-fetched record or fetch again
        if not patient_details:
            if self.current_patient:
                patient_details = self.current_patient
            else:
                print("No specific patient detected, fetching most recent record...")
                patient_details = await self.fetch_most_recent_patient()
        
        # Generate summary
        summary = self.generate_summary(full_transcription, patient_details)
        
        # Send summary back to client
        await self.send(text_data=json.dumps({
            'type': 'summary',
            'patient_details': patient_details,
            'summary': summary
        }))

    def extract_patient_name(self, transcription):
        """
        Extract patient name from transcription using simple pattern matching.
        """
        # Look for common patterns like "patient [name]" or "for [name]"
        patterns = [
            r'patient\s+([A-Z][a-z]+)',
            r'for\s+([A-Z][a-z]+)',
            r'([A-Z][a-z]+)\s+mentioned',
            r'saw\s+patient\s+([A-Z][a-z]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, transcription)
            if match:
                return match.group(1)
        
        return None

    async def fetch_patient_details(self, name):
        """
        Fetch patient details from Node.js API by searching by name.
        """
        try:
            response = requests.get(
                f"{NODE_API_URL}/api/patients/search",
                params={'name': name},
                timeout=5
            )
            
            if response.status_code == 200:
                patients = response.json()
                if patients and len(patients) > 0:
                    return patients[0]  # Return first match
        except Exception as e:
            print(f"Error fetching patient details: {e}")
        
        return None

    async def fetch_most_recent_patient(self):
        """
        Fetch the most recently created patient from Node.js API.
        """
        try:
            response = requests.get(
                f"{NODE_API_URL}/api/patients",
                timeout=5
            )
            
            if response.status_code == 200:
                patients = response.json()
                if patients and len(patients) > 0:
                    # server.js returns ORDER BY created_at DESC, so first one is most recent
                    return patients[0]
        except Exception as e:
            print(f"Error fetching most recent patient: {e}")
        
        return None

    def generate_summary(self, transcription, patient_details):
        """
        Generate a structured summary document.
        """
        summary_parts = []
        
        summary_parts.append("MEDICAL CONSULTATION SUMMARY")
        summary_parts.append("=" * 50)
        summary_parts.append("")
        
        predicted_medicine = "Not prescribed"
        if patient_details:
            summary_parts.append(f"Patient: {patient_details.get('name')}")
            summary_parts.append(f"DOB: {patient_details.get('date_of_birth')}")
            summary_parts.append(f"Diagnosis: {patient_details.get('diagnosis')}")
            predicted_medicine = self.predict_medicine(patient_details.get('diagnosis'))
            summary_parts.append(f"Predicted Medicine: {predicted_medicine}")
            summary_parts.append("")
        else:
            summary_parts.append("Patient: Not specified (Recent entry fallback)")
            summary_parts.append("")
        
        summary_parts.append("Consultation Notes:")
        summary_parts.append(transcription)
        summary_parts.append("")
        
        summary_parts.append("Prescription Details:")
        summary_parts.append(f"- Recommended: {predicted_medicine}")
        summary_parts.append("- Dosage: As directed by physician")
        
        summary_parts.append("")
        summary_parts.append("Next Steps:")
        if "follow-up" in transcription.lower() or "follow up" in transcription.lower():
            summary_parts.append("- Schedule follow-up appointment")
        
        summary_parts.append("")
        summary_parts.append("=" * 50)
        
        return "\n".join(summary_parts)
