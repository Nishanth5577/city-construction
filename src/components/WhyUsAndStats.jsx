import React, { useRef, useEffect, useState } from 'react';
import { stats } from '../data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const whyItems = [
  { label: 'QUALITY', text: 'Precision from planning to completion. Every material, every measurement, every detail.' },
  { label: 'TRANSPARENCY', text: 'Clear communication throughout your project. No surprises, no hidden costs.' },
  { label: 'ENGINEERING', text: 'Strong technical foundations behind every structure we build.' },
  { label: 'DESIGN', text: 'Modern architectural thinking combined with practical, functional execution.' },
  { label: 'RELIABILITY', text: 'Construction focused on long-term value and structural integrity.' },
];

function AnimatedNumber({ value, suffix, inView }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, value]);

  return <span>{display}<span className="stat-suffix">{suffix}</span></span>;
}

export default function WhyUsAndStats() {
  const whyRef = useRef(null);
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Why section animations
      gsap.from('.why-header > *', {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: whyRef.current, start: 'top 75%' },
      });

      gsap.from('.why-item', {
        y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.why-grid', start: 'top 80%' },
      });

      // Stats animation trigger
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 70%',
        onEnter: () => setStatsInView(true),
      });

      gsap.from('.stat-item', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: statsRef.current, start: 'top 75%' },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="section why-section" id="why" ref={whyRef}>
        <div className="why-header">
          <div className="section-number">WHY CHOOSE US</div>
          <h2 className="section-heading">WHY CITY <span className="accent">CONSTRUCTIONS</span></h2>
          <div className="section-line" />
        </div>

        <div className="why-grid">
          {whyItems.map((item, i) => (
            <div className="why-item" key={item.label}>
              <div className="why-label">{item.label}</div>
              <div className="why-text">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-value">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={statsInView} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
