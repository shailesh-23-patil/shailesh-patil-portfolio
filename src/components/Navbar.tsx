import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Palette } from '../hooks/useTheme';

interface Props {
  theme: string;
  palette: Palette;
  toggleTheme: () => void;
  setPalette: (p: Palette) => void;
  scrollTo: (id: string) => void;
  openCmd: () => void;
}

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'featured-projects' },
  { label: 'Journey', id: 'journey' },
  { label: 'Contact', id: 'contact' },
];

const paletteColors: Record<Palette, string> = {
  crimson: 'hsl(0, 72%, 50%)',
  emerald: 'hsl(152, 60%, 45%)',
  navy: 'hsl(220, 65%, 48%)',
};

export default function Navbar({ theme, palette, toggleTheme, setPalette, scrollTo, openCmd }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = useCallback((id: string) => {
    scrollTo(id);
    setMobileOpen(false);
  }, [scrollTo]);

  return (
    <nav ref={navRef} className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', letterSpacing: '-0.02em' }}
          aria-label="Scroll to top"
        >
          SP<span style={{ color: 'var(--accent)' }}>.</span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
            >
              {link.label}
            </button>
          ))}

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 0.5rem' }} />

          {/* Palette dots */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }} aria-label="Switch accent color">
            {(Object.keys(paletteColors) as Palette[]).map((p) => (
              <button
                key={p}
                onClick={() => setPalette(p)}
                aria-label={`${p} palette`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: paletteColors[p],
                  border: palette === p ? '2px solid var(--text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'border var(--transition-fast)',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ fontSize: '1rem', padding: '0.4rem 0.6rem' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Cmd K */}
          <button
            onClick={openCmd}
            className="btn-ghost"
            style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '0.375rem' }}
            aria-label="Open command palette"
          >
            ⌘K
          </button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-burger"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
            style={{
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    padding: '0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '0.5rem',
                    transition: 'background 0.2s',
                  }}
                >
                  {link.label}
                </button>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(Object.keys(paletteColors) as Palette[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPalette(p)}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: paletteColors[p],
                        border: palette === p ? '2px solid var(--text-primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
