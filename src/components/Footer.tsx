import { personal } from '../data/content';
import type { Palette } from '../hooks/useTheme';

interface Props {
  scrollTo: (id: string) => void;
  theme: string;
  palette: Palette;
  toggleTheme: () => void;
  setPalette: (p: Palette) => void;
}

export default function Footer({ scrollTo }: Props) {
  return (
    <footer
      style={{
        padding: '3rem 0 2rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        transition: 'background var(--transition-theme)',
      }}
    >
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} Shailesh Patil — Built with React, TypeScript & Framer Motion
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.8rem' }} aria-label="GitHub">
            GitHub
          </a>
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.8rem' }} aria-label="LinkedIn">
            LinkedIn
          </a>
          <button
            onClick={() => scrollTo('hero')}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
            aria-label="Back to top"
          >
            ↑ Top
          </button>
        </div>
      </div>
    </footer>
  );
}
