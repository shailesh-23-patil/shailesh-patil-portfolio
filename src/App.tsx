import { memo, useEffect, useState, useCallback, useRef } from 'react';
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

// Memoized so that opening the command palette, showing a toast, or finishing
// the loading screen does NOT re-render every section of the page.
const HeroSection = memo(Hero);
const AboutSection = memo(About);
const SkillsSection = memo(Skills);
const FeaturedProjectsSection = memo(FeaturedProjects);
const AllProjectsSection = memo(AllProjects);
const DataDetectiveSection = memo(DataDetective);
const JourneySection = memo(Journey);
const ContactSection = memo(Contact);
const GrainOverlayMemo = memo(GrainOverlay);
const CustomCursorMemo = memo(CustomCursor);
const ScrollProgressMemo = memo(ScrollProgress);

function App() {
  const { theme, palette, toggleTheme, setPalette } = useTheme();
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Initialize Lenis smooth scrolling
  // FIX: the old version never cancelled its requestAnimationFrame loop, so after
  // cleanup (or React StrictMode's double-run in dev) extra loops kept running
  // forever and fought each other. Now the loop is cancelled properly.
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Pause page scrolling while the command palette is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (cmdOpen) lenis.stop();
    else lenis.start();
  }, [cmdOpen]);

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

  // FIX: clear the previous timer so a new toast isn't hidden early by an old timeout
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), reducedMotion ? 100 : 1400);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <>
      {loading && <LoadingIntro />}
      <CustomCursorMemo />
      <ScrollProgressMemo />
      <GrainOverlayMemo />
      <Navbar
        theme={theme}
        palette={palette}
        toggleTheme={toggleTheme}
        setPalette={setPalette}
        scrollTo={scrollTo}
        openCmd={() => setCmdOpen(true)}
      />
      <main>
        <HeroSection scrollTo={scrollTo} />
        <AboutSection />
        <SkillsSection />
        <FeaturedProjectsSection showToast={showToast} />
        <AllProjectsSection showToast={showToast} />
        <DataDetectiveSection />
        <JourneySection />
        <ContactSection showToast={showToast} />
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