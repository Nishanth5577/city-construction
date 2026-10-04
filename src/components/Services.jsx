import React, { useRef, useEffect } from 'react';
import { services } from '../data/services';
import { HiOutlineHome, HiOutlineBuildingOffice2, HiOutlinePaintBrush, HiOutlineWrenchScrewdriver, HiOutlineArrowPath, HiOutlineCubeTransparent } from 'react-icons/hi2';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('.services-header .section-number', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.from('.services-header .section-heading', {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
      gsap.from('.services-header .section-line', {
        scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      });

      // Horizontal scroll animation
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth + 96;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services-section" id="services" ref={sectionRef}>
      <div className="services-header">
        <div className="section-number">OUR EXPERTISE</div>
        <h2 className="section-heading">WHAT WE <span className="accent">BUILD</span></h2>
        <div className="section-line" />
      </div>

      <div className="services-track" ref={trackRef}>
        {services.map((service, i) => {
          const Icon = iconMap[service.icon] || HiOutlineCubeTransparent;
          return (
            <div className="service-card" key={service.id}>
              <div className="service-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="service-icon"><Icon /></div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
