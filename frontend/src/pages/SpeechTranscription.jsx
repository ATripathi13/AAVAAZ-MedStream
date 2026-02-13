import { useState, useRef, useEffect } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export default function SpeechTranscription() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const wsRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            setError(null);
            setSummary(null);
            setTranscription('');

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Connect WebSocket
            wsRef.current = new WebSocket(`${WS_URL}/ws/transcribe/`);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected');
            };

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'transcription') {
                    setTranscription((prev) => prev + ' ' + data.text);
                } else if (data.type === 'summary') {
                    setSummary(data);
                    setIsRecording(false);
                } else if (data.type === 'error') {
                    setError(data.message);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket connection error');
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket closed');
            };

            // Setup MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                    // Send audio chunk to backend
                    event.data.arrayBuffer().then((buffer) => {
                        wsRef.current.send(buffer);
                    });
                }
            };

            mediaRecorder.start(250); // Send chunks every 250ms
            setIsRecording(true);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Failed to access microphone: ' + err.message);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ action: 'stop' }));
        }

        setIsRecording(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center fade-in">
            {/* Title Section */}
            <div className="mb-12">
                <h1 className="text-6xl md:text-8xl font-light text-white tracking-wider mb-6 heading-font">
                    SPEECH
                </h1>
                <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-wider mb-4 heading-font">
                    TRANSCRIPTION
                </h2>
                <p className="text-white/70 text-lg max-w-md">
                    Real-time speech-to-summary generation
                </p>
            </div>

            {/* Recording Controls */}
            <div className="mb-12 space-x-6">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="border border-white/60 hover:bg-white/10 text-white font-light py-4 px-12 rounded-full uppercase tracking-[0.2em] transition-all transform hover:scale-105 backdrop-blur-sm"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="border border-red-400/60 hover:bg-red-500/10 text-red-200 font-light py-4 px-12 rounded-full uppercase tracking-[0.2em] transition-all transform hover:scale-105 backdrop-blur-sm animate-pulse"
                    >
                        Stop Recording
                    </button>
                )}
            </div>

            {/* Live Transcription */}
            {transcription && (
                <div className="w-full max-w-3xl mb-8">
                    <h3 className="text-white/80 text-xl uppercase tracking-wide mb-4">
                        Live Transcription
                    </h3>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6 text-white/90 text-left">
                        <p className="whitespace-pre-wrap">{transcription}</p>
                    </div>
                </div>
            )}

            {/* Summary Section */}
            {summary && (
                <div className="w-full max-w-3xl space-y-6">
                    {/* Patient Details */}
                    {summary.patient_details && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6">
                            <h3 className="text-white text-2xl uppercase tracking-wide mb-4 heading-font">
                                Patient Details
                            </h3>
                            <div className="text-left space-y-2 text-white/80">
                                <p><strong>Name:</strong> {summary.patient_details.name}</p>
                                <p><strong>Date of Birth:</strong> {summary.patient_details.date_of_birth}</p>
                                <p><strong>Phone:</strong> {summary.patient_details.phone}</p>
                                <p><strong>Address:</strong> {summary.patient_details.address}</p>
                                <p><strong>Diagnosis:</strong> {summary.patient_details.diagnosis}</p>
                            </div>
                        </div>
                    )}

                    {/* Summary Document */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6">
                        <h3 className="text-white text-2xl uppercase tracking-wide mb-4 heading-font">
                            Summary Document
                        </h3>
                        <div className="text-left text-white/90 whitespace-pre-wrap">
                            {summary.summary}
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="w-full max-w-3xl mt-6">
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-300">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
