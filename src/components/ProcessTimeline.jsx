import React, { useRef, useEffect, useState } from 'react';
import { processSteps } from '../data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTimeline() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-header > *', {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // Each step reveals on scroll
      const steps = gsap.utils.toArray('.process-step');
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 65%',
          onEnter: () => {
            setActiveIndex(i);
            gsap.to(step, { opacity: 1, duration: 0.5 });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeIndex < 0 || !sectionRef.current) return;
    const steps = sectionRef.current.querySelectorAll('.process-step');
    const timeline = sectionRef.current.querySelector('.process-timeline');
    if (steps[activeIndex] && timeline) {
      const timelineRect = timeline.getBoundingClientRect();
      const stepRect = steps[activeIndex].getBoundingClientRect();
      setFillHeight(Math.max(0, stepRect.top - timelineRect.top + stepRect.height / 2));
    }
  }, [activeIndex]);

  return (
    <section className="section process-section" id="process" ref={sectionRef}>
      <div className="process-header">
        <div className="section-number">HOW WE WORK</div>
        <h2 className="section-heading">CONSTRUCTION <span className="accent">PROCESS</span></h2>
        <div className="section-line" />
      </div>

      <div className="process-timeline">
        <div className="process-line">
          <div className="process-line-fill" style={{ height: `${fillHeight}px` }} />
        </div>

        {processSteps.map((step, i) => (
          <div className={`process-step ${i <= activeIndex ? 'active' : ''}`} key={step.number}>
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
