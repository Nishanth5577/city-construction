import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60;
    
    const interval = setInterval(() => {
      frame++;
      // Ease-out cubic for natural feel
      const t = frame / totalFrames;
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.min(eased * 100, 100);
      setProgress(value);
      
      if (frame >= totalFrames) {
        clearInterval(interval);
        setTimeout(() => {
          setLoaded(true);
          setTimeout(() => onComplete?.(), 1000);
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${loaded ? 'loaded' : ''}`}>
      <div className="loading-logo-wrapper">
        <div className="loading-logo">CITY</div>
        <div className="loading-logo-sub">CONSTRUCTIONS</div>
      </div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-text">INITIALIZING ARCHITECTURAL EXPERIENCE</div>
      <div className="loading-percent">{String(Math.floor(progress)).padStart(2, '0')}%</div>
    </div>
  );
}
