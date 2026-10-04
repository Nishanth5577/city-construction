import React, { useRef, useEffect, useState } from 'react';
import { processSteps } from '../data/projects';

export default function ProcessTimeline() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const steps = sectionRef.current.querySelectorAll('.process-step');
      let lastActive = -1;

      steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          lastActive = i;
        }
      });

      setActiveIndex(lastActive);

      // Calculate fill height
      if (lastActive >= 0 && steps[lastActive]) {
        const timelineRect = sectionRef.current.querySelector('.process-timeline').getBoundingClientRect();
        const stepRect = steps[lastActive].getBoundingClientRect();
        const fill = stepRect.top - timelineRect.top + stepRect.height / 2;
        setFillHeight(Math.max(0, fill));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="section process-section" id="process" ref={sectionRef}>
      <div className="section-number">HOW WE WORK</div>
      <h2 className="section-heading">CONSTRUCTION PROCESS</h2>
      <div className="section-line" />

      <div className="process-timeline">
        <div className="process-line">
          <div className="process-line-fill" style={{ height: `${fillHeight}px` }} />
        </div>

        {processSteps.map((step, i) => (
          <div
            className={`process-step ${i <= activeIndex ? 'active' : ''}`}
            key={step.number}
          >
            <div className="process-dot" />
            <div className="process-number">{step.number}</div>
            <div className="process-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
