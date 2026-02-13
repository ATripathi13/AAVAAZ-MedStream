import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PatientCreation from './pages/PatientCreation';
import SpeechTranscription from './pages/SpeechTranscription';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-creation" element={<PatientCreation />} />
          <Route path="/speech-transcription" element={<SpeechTranscription />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
