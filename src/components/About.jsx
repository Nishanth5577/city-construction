import React, { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = sectionRef.current?.querySelectorAll('.about-animate');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <div className="about-blueprint" />

      <div className="about-grid">
        <div>
          <div className="section-number about-animate" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease' }}>
            ABOUT US
          </div>
          <h2 className="section-heading about-animate" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.1s' }}>
            WE TURN IDEAS<br />INTO STRUCTURES.
          </h2>
          <div className="section-line about-animate" style={{ opacity: 0, transform: 'scaleX(0)', transition: 'all 0.8s ease 0.2s', transformOrigin: 'left' }} />
          <p className="section-text about-animate" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.3s' }}>
            City Constructions delivers quality construction through meticulous planning, 
            precision engineering, modern design, disciplined execution and attention to detail. 
            Every project is a commitment to creating lasting value — structures that stand the test of time 
            and spaces that elevate the way people live and work.
          </p>

          <div className="about-director about-animate" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.4s' }}>
            <div className="about-director-label">Managing Director</div>
            <div className="about-director-name">GANGADHARAN G</div>
            <div className="about-director-title">City Constructions</div>
          </div>
        </div>

        <div className="about-visual about-animate" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s ease 0.5s' }}>
          {/* Architectural grid lines */}
          <div className="about-visual-lines">
            {[20, 40, 60, 80].map((p) => (
              <div key={`h-${p}`} className="about-visual-line h" style={{ top: `${p}%` }} />
            ))}
            {[20, 40, 60, 80].map((p) => (
              <div key={`v-${p}`} className="about-visual-line v" style={{ left: `${p}%` }} />
            ))}
          </div>

          {/* Central architectural element */}
          <div style={{
            width: '200px',
            height: '280px',
            border: '1px solid var(--dark-gray)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '48px',
              fontWeight: 200,
              letterSpacing: '4px',
              color: 'var(--accent)',
              lineHeight: 1,
            }}>
              CC
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '6px',
              color: 'var(--concrete)',
              marginTop: '16px',
              textTransform: 'uppercase',
            }}>
              EST. 2014
            </div>

            {/* Measurement lines */}
            <div style={{
              position: 'absolute',
              right: '-50px',
              top: 0,
              height: '100%',
              width: '1px',
              background: 'var(--dark-gray)',
            }}>
              <span style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '3px',
                color: 'var(--concrete)',
                whiteSpace: 'nowrap',
              }}>
                ELEVATION
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-animate.visible {
          opacity: 1 !important;
          transform: translateY(0) scaleX(1) !important;
        }
      `}</style>
    </section>
  );
}
