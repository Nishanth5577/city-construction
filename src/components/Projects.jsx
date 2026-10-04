import React from 'react';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-number">PROJECT PORTFOLIO</div>
      <h2 className="section-heading">SELECTED WORKS</h2>
      <div className="section-line" />

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <div className="project-bg">
              {/* Geometric pattern unique to each project */}
              <svg
                viewBox="0 0 400 400"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',
                  height: '60%',
                  opacity: 0.08,
                }}
              >
                <rect x="40" y="40" width="320" height="320" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
                <rect x="80" y="80" width="240" height="240" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="var(--accent)" strokeWidth="0.3" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="var(--accent)" strokeWidth="0.3" />
                <circle cx="200" cy="200" r="80" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
              </svg>

              {/* Project year display */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                fontFamily: 'var(--font-heading)',
                fontSize: '64px',
                fontWeight: 200,
                color: 'rgba(200, 169, 126, 0.06)',
                lineHeight: 1,
              }}>
                {project.year}
              </div>
            </div>

            {/* Architectural lines on hover */}
            <div className="project-architectural-lines">
              <div className="project-arch-line h" style={{ top: '30%' }} />
              <div className="project-arch-line h" style={{ top: '60%' }} />
              <div className="project-arch-line v" style={{ left: '30%' }} />
              <div className="project-arch-line v" style={{ left: '70%' }} />
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
