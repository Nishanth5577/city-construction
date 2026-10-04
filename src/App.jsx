import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BuildingAssembly = lazy(() => import('./components/BuildingAssembly'));
const ExplodedBuilding = lazy(() => import('./components/ExplodedBuilding'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Projects = lazy(() => import('./components/Projects'));
const BlueprintToBuilding = lazy(() => import('./components/BlueprintToBuilding'));
const ProcessTimeline = lazy(() => import('./components/ProcessTimeline'));
const DesignStudio = lazy(() => import('./components/DesignStudio'));
const WhyUsAndStats = lazy(() => import('./components/WhyUsAndStats'));
const Contact = lazy(() => import('./components/Contact'));

function SectionFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: '4px',
      color: 'var(--concrete)',
      textTransform: 'uppercase',
    }}>
      <div className="loading-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef(null);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Initialize Lenis smooth scroll + GSAP integration
  useEffect(() => {
    if (!isLoaded) return;

    let lenis;
    let rafId;

    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } catch (e) {
        // Fallback if Lenis fails
        console.log('Smooth scroll fallback');
      }
    };

    initLenis();

    // Global GSAP reveal animations for common elements
    const timer = setTimeout(() => {
      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      gsap.utils.toArray('.reveal-line').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });

      gsap.utils.toArray('.reveal-up').forEach((el, i) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          delay: (el.dataset.delay || 0) * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        });
      });

      gsap.utils.toArray('.reveal-fade').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });

      gsap.utils.toArray('.parallax-slow').forEach((el) => {
        gsap.to(el, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (lenis) lenis.destroy();
    };
  }, [isLoaded]);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />

      {isLoaded && (
        <>
          <CustomCursor />
          <Navbar />

          <main ref={mainRef}>
            <Hero3D />

            <Suspense fallback={<SectionFallback />}>
              <BuildingAssembly />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <ExplodedBuilding />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <Services />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <BlueprintToBuilding />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <ProcessTimeline />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <DesignStudio />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <WhyUsAndStats />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>

            <Footer />
          </main>
        </>
      )}
    </>
  );
}
