import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mosquito from './mosquito.svg';
import './App.css';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState('safe');
    const [modIndex, setModIndex] = useState(1000);
  const [feedbacks, setFeedbacks] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);
  const audioCtxRef = useRef(null);
  const carrierRef = useRef(null);
  const modulatorRef = useRef(null);
  const modGainRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (modGainRef.current) {
      modGainRef.current.gain.value = modIndex;
    }
  }, [modIndex]);

  const startAudio = () => {
    if (isPlaying) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const carrier = audioCtx.createOscillator();
    const modulator = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();

    carrier.frequency.value = mode === 'safe' ? 15000 : 19000;
    modulator.frequency.value = 3000;
    modGain.gain.value = modIndex;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(audioCtx.destination);

    carrier.start();
    modulator.start();

    audioCtxRef.current = audioCtx;
    carrierRef.current = carrier;
    modulatorRef.current = modulator;
    modGainRef.current = modGain;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (!isPlaying) return;
    carrierRef.current.stop();
    modulatorRef.current.stop();
    audioCtxRef.current.close();
    setIsPlaying(false);
  };

  const getCoords = () => {
    const locale = navigator.language || '';
    const region = locale.split('-')[1];
    switch (region) {
      case 'US':
        return [37.7749, -122.4194];
      case 'GB':
        return [51.5074, -0.1278];
      case 'FR':
        return [48.8566, 2.3522];
      case 'JP':
        return [35.6762, 139.6503];
      default:
        return [0, 0];
    }
  };

  const handleFeedback = (result) => {
    const data = {
      result,
      timestamp: new Date().toISOString(),
      locale: navigator.language || 'Unknown',
      mode
    };
    setFeedbacks((prev) => [...prev, data]);
    setLastFeedback(result);

    const coords = getCoords();
    L.marker(coords)
      .addTo(mapRef.current)
      .bindPopup(`${result} @ ${data.timestamp}`);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(feedbacks, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareText = (res) => {
    switch (res) {
      case 'Effective':
        return '✅ Effective';
      case 'Not Effective':
        return '❌ Not Effective';
      default:
        return '🤔 Unclear';
    }
  };

  const shareUrl = lastFeedback
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Tried the #MosquitoTest2025 🦟
My result: ${shareText(lastFeedback)}
Join the experiment here: https://kg-ninja.github.io/FMMosquit`
      )}`
    : null;

  return (
    <div className="app">
      <h1>FM Mosquito Repellent</h1>
      <div>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="safe">Safe Mode (15–18 kHz)</option>
          <option value="experiment">Experiment Mode (18–20 kHz)</option>
        </select>
      </div>
      <div>
        <label>
          Modulation Index
          <input
            type="range"
            min="0"
            max="2000"
            value={modIndex}
            onChange={(e) => setModIndex(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={startAudio}>Start (Mosquito Repellent ON)</button>
      <button onClick={stopAudio}>Stop (OFF)</button>
      <div className={`mosquito ${isPlaying ? 'fly' : ''}`}>
        <img src={mosquito} alt="mosquito" />
      </div>
      <div className="feedback">
        <button onClick={() => handleFeedback('Effective')}>Effective</button>
        <button onClick={() => handleFeedback('Not Effective')}>Not Effective</button>
        <button onClick={() => handleFeedback('Unclear')}>Unclear</button>
        <button onClick={exportData}>Export Feedback</button>
        {shareUrl && (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            Share on Twitter
          </a>
        )}
      </div>
      <div id="map"></div>
      <footer>
        <a href="https://www.buymeacoffee.com/yourname" target="_blank" rel="noopener noreferrer">
          ☕ Support the experiment
        </a>
      </footer>
    </div>
  );
}
