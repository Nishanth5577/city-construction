import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.about-number', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.about-heading', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .from('.about-line', { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.inOut' }, '-=0.6')
        .from('.about-text', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .from('.about-director', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.about-visual-wrapper', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <div className="about-grid">
        <div>
          <div className="section-number about-number">ABOUT US</div>
          <h2 className="section-heading about-heading">
            WE TURN IDEAS<br />INTO <span className="accent">STRUCTURES.</span>
          </h2>
          <div className="section-line about-line" />
          <p className="section-text about-text">
            City Constructions delivers quality construction through meticulous planning, 
            precision engineering, modern design, disciplined execution and uncompromising 
            attention to detail. Every project is a commitment to creating lasting value — 
            structures that stand the test of time and spaces that elevate the way people 
            live and work.
          </p>

          <div className="about-director">
            <div className="about-director-label">Managing Director</div>
            <div className="about-director-name">GANGADHARAN G</div>
            <div className="about-director-title">City Constructions</div>
          </div>
        </div>

        <div className="about-visual about-visual-wrapper">
          <div className="about-visual-lines">
            {[20, 40, 60, 80].map((p) => (
              <div key={`h-${p}`} className="about-visual-line h" style={{ top: `${p}%` }} />
            ))}
            {[20, 40, 60, 80].map((p) => (
              <div key={`v-${p}`} className="about-visual-line v" style={{ left: `${p}%` }} />
            ))}
          </div>

          <div style={{
            width: '220px',
            height: '300px',
            border: '1px solid var(--dark-gray)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--glass)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '56px',
              fontWeight: 300,
              letterSpacing: '6px',
              color: 'var(--accent)',
              lineHeight: 1,
            }}>
              CC
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              letterSpacing: '7px',
              color: 'var(--mid-gray)',
              marginTop: '18px',
              textTransform: 'uppercase',
            }}>
              EST. 2014
            </div>
            <div style={{
              position: 'absolute',
              bottom: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              letterSpacing: '4px',
              color: 'var(--dark-gray)',
              textTransform: 'uppercase',
            }}>
              KUMBAKONAM
            </div>

            {/* Measurement annotation */}
            <div style={{
              position: 'absolute',
              right: '-56px',
              top: 0,
              height: '100%',
              width: '1px',
              background: 'var(--dark-gray)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: '-3px', width: '7px', height: '1px', background: 'var(--dark-gray)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: '-3px', width: '7px', height: '1px', background: 'var(--dark-gray)' }} />
              <span style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '7px',
                letterSpacing: '3px',
                color: 'var(--mid-gray)',
                whiteSpace: 'nowrap',
              }}>
                ELEVATION A-01
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
