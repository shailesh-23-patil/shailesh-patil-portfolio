import { useEffect, useState, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import { useTheme } from './hooks/useTheme';
import { useReducedMotion } from './hooks/useReducedMotion';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import GrainOverlay from './components/GrainOverlay';
import LoadingIntro from './components/LoadingIntro';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import FeaturedProjects from './sections/FeaturedProjects';
import AllProjects from './sections/AllProjects';
import DataDetective from './sections/DataDetective';
import Journey from './sections/Journey';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  const { theme, palette, toggleTheme, setPalette } = useTheme();
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [reducedMotion]);

  // Scroll to section helper
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), reducedMotion ? 100 : 1400);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <>
      {loading && <LoadingIntro />}
      <CustomCursor />
      <ScrollProgress />
      <GrainOverlay />
      <Navbar
        theme={theme}
        palette={palette}
        toggleTheme={toggleTheme}
        setPalette={setPalette}
        scrollTo={scrollTo}
        openCmd={() => setCmdOpen(true)}
      />
      <main>
        <Hero scrollTo={scrollTo} />
        <About />
        <Skills />
        <FeaturedProjects showToast={showToast} />
        <AllProjects showToast={showToast} />
        <DataDetective />
        <Journey />
        <Contact showToast={showToast} />
      </main>
      <Footer scrollTo={scrollTo} theme={theme} palette={palette} toggleTheme={toggleTheme} setPalette={setPalette} />
      {cmdOpen && (
        <CommandPalette
          onClose={() => setCmdOpen(false)}
          scrollTo={scrollTo}
          toggleTheme={toggleTheme}
          setPalette={setPalette}
          showToast={showToast}
        />
      )}
      <Toast message={toast} />
    </>
  );
}

export default App;
