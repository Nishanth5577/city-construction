import React, { useRef, useEffect } from 'react';
import { projects } from '../data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects-header > *', {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      gsap.from('.project-card', {
        y: 80, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section projects-section" id="projects" ref={sectionRef}>
      <div className="projects-header">
        <div className="section-number">PROJECT PORTFOLIO</div>
        <h2 className="section-heading">SELECTED <span className="accent">WORKS</span></h2>
        <div className="section-line" />
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <div className="project-bg">
              <svg viewBox="0 0 400 400" style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: '55%', height: '55%', opacity: 0.06,
              }}>
                <rect x="40" y="40" width="320" height="320" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
                <rect x="80" y="80" width="240" height="240" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="var(--accent)" strokeWidth="0.3" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="var(--accent)" strokeWidth="0.3" />
                <circle cx="200" cy="200" r="80" fill="none" stroke="var(--accent)" strokeWidth="0.4" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="var(--accent)" strokeWidth="0.2" />
              </svg>
              <div style={{
                position: 'absolute', top: '24px', right: '24px',
                fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 300,
                color: 'rgba(200, 169, 126, 0.04)', lineHeight: 1,
              }}>{project.year}</div>
            </div>

            <div className="project-architectural-lines">
              <div className="project-arch-line h" style={{ top: '25%' }} />
              <div className="project-arch-line h" style={{ top: '50%' }} />
              <div className="project-arch-line h" style={{ top: '75%' }} />
              <div className="project-arch-line v" style={{ left: '25%' }} />
              <div className="project-arch-line v" style={{ left: '75%' }} />
            </div>

            <div className="project-content">
              <div className="project-type">{project.type}</div>
              <h3 className="project-name">{project.name}</h3>
              <div className="project-location">{project.location}</div>
              <span className={`project-status ${project.status === 'Completed' ? 'completed' : 'in-progress'}`}>
                {project.status}
              </span>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
