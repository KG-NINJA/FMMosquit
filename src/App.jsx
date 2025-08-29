import { useEffect, useMemo, useRef, useState } from 'react';
import { startFM, stopFM, startJitter, stopJitter } from './audio/fm';
import MapView from './map/MapView';
import MosquitoIcon from './components/MosquitoIcon';

const SITE_URL = 'https://kg-ninja.github.io/FMMosquit';
const BMC_URL = 'https://www.buymeacoffee.com/YOUR_BMC_HANDLE'; // TODO: replace

export default function App() {
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState('safe'); // 'safe' (15–18kHz-ish) or 'experiment'
  const [feedback, setFeedback] = useState([]); // in-memory JSON
  const [coords, setCoords] = useState(null);
  const jitterTimer = useRef(null);

  // ask for location once
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const locale = useMemo(() => navigator.language || 'Unknown', []);

  const onStart = () => {
    if (isOn) return;
    if (mode === 'safe') {
      startFM({ carrierHz: 10000, modHz: 3000, index: 3000 });
      startJitter({ minModHz: 2500, maxModHz: 3500, minIndex: 2500, maxIndex: 3500, periodMs: 1200 });
    } else {
      startFM({ carrierHz: 11000, modHz: 3200, index: 5000 });
      startJitter({ minModHz: 2200, maxModHz: 5000, minIndex: 3500, maxIndex: 6500, periodMs: 800 });
    }
    setIsOn(true);
  };

  const onStop = () => {
    stopJitter();
    stopFM();
    setIsOn(false);
  };

  const addFeedback = (result) => {
    const entry = {
      result, // 'effective' | 'ineffective' | 'unclear'
      ts: new Date().toISOString(),
      locale,
      mode,
      coords: coords ? { ...coords } : null
    };
    setFeedback((prev) => [...prev, entry]);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(feedback, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'feedback.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareOnTwitter = (lastResult) => {
    const text = encodeURIComponent(
      `Tried the #MosquitoTest2025 🦟\nMy result: ${lastResult}\n`
    );
    const url = encodeURIComponent(SITE_URL);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  useEffect(() => {
    return () => { stopJitter(); stopFM(); };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>FMMosquit</h1>
        <p>FM-modulated high-frequency demo + global feedback map</p>
      </header>

      <section className="controls">
        <div className="mode">
          <label>
            <input type="radio" name="mode" value="safe"
              checked={mode==='safe'} onChange={() => setMode('safe')} />
            Pet-safe mode (≈15–18kHz)
          </label>
          <label>
            <input type="radio" name="mode" value="experiment"
              checked={mode==='experiment'} onChange={() => setMode('experiment')} />
            Experiment mode (≈18–20kHz)
          </label>
        </div>

        <div className="buttons">
          {!isOn ? (
            <button className="primary" onClick={onStart}>Mosquito Repellent ON</button>
          ) : (
            <button className="danger" onClick={onStop}>OFF</button>
          )}
        </div>

        <div className="mosquitoWrap">
          <MosquitoIcon active={isOn} />
        </div>
      </section>

      <section className="feedback">
        <h2>Your feedback</h2>
        <div className="buttons">
          <button onClick={() => { addFeedback('✅ Effective'); shareOnTwitter('✅ Effective'); }}>Effective</button>
          <button onClick={() => { addFeedback('❌ Not Effective'); shareOnTwitter('❌ Not Effective'); }}>Not Effective</button>
          <button onClick={() => { addFeedback('🤔 Unclear'); shareOnTwitter('🤔 Unclear'); }}>Unclear</button>
        </div>
        <div className="export">
          <button onClick={exportJSON}>Export feedback.json</button>
        </div>
      </section>

      <section className="map">
        <h2>Global feedback map</h2>
        <MapView data={feedback} />
      </section>

      <footer>
        <a href={BMC_URL} target="_blank" rel="noreferrer">☕ Support this experiment on BuyMeACoffee</a>
        <span> • </span>
        <a href={SITE_URL} target="_blank" rel="noreferrer">{SITE_URL}</a>
      </footer>
    </div>
  );
}

