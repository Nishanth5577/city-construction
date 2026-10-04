import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 12 + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoaded(true);
            setTimeout(() => onComplete?.(), 800);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${loaded ? 'loaded' : ''}`}>
      <div className="loading-logo">CITY</div>
      <div className="loading-logo-sub">CONSTRUCTIONS</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="loading-text">INITIALIZING ARCHITECTURAL EXPERIENCE</div>
      <div className="loading-percent">{Math.floor(Math.min(progress, 100))}%</div>
    </div>
  );
}
