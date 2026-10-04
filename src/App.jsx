import React, { useState, useCallback, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import Footer from './components/Footer';

// Lazy-load heavy 3D sections for performance
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
      Loading section...
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />

      {isLoaded && (
        <>
          <CustomCursor />
          <Navbar />

          <main>
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
