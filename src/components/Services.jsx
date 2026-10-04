import React, { useRef, useEffect } from 'react';
import { services } from '../data/services';
import { HiOutlineHome, HiOutlineBuildingOffice2, HiOutlinePaintBrush, HiOutlineWrenchScrewdriver, HiOutlineArrowPath, HiOutlineCubeTransparent } from 'react-icons/hi2';

const iconMap = {
  home: HiOutlineHome,
  building: HiOutlineBuildingOffice2,
  design: HiOutlinePaintBrush,
  engineering: HiOutlineWrenchScrewdriver,
  renovation: HiOutlineArrowPath,
  '3d': HiOutlineCubeTransparent,
};

export default function Services() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (sectionTop < viewportHeight && sectionTop > -sectionHeight) {
        const progress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (sectionHeight + viewportHeight)));
        const maxScroll = trackRef.current.scrollWidth - window.innerWidth + 96;
        trackRef.current.style.transform = `translateX(-${progress * maxScroll}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="services-section" id="services" ref={sectionRef} style={{ height: '200vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="services-header">
          <div className="section-number">OUR SERVICES</div>
          <h2 className="section-heading">WHAT WE BUILD</h2>
          <div className="section-line" />
        </div>

        <div className="services-track" ref={trackRef}>
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || HiOutlineCubeTransparent;
            return (
              <div className="service-card" key={service.id}>
                <div className="service-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="service-icon">
                  <Icon />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
