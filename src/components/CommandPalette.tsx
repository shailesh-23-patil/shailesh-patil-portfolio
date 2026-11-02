import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '../data/content';
import type { Palette } from '../hooks/useTheme';

interface Props {
  onClose: () => void;
  scrollTo: (id: string) => void;
  toggleTheme: () => void;
  setPalette: (p: Palette) => void;
  showToast: (msg: string) => void;
}

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({ onClose, scrollTo, toggleTheme, setPalette, showToast }: Props) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'about', label: 'Go to About', icon: '👤', action: () => { scrollTo('about'); onClose(); } },
    { id: 'skills', label: 'Go to Skills', icon: '⚡', action: () => { scrollTo('skills'); onClose(); } },
    { id: 'projects', label: 'Go to Projects', icon: '📂', action: () => { scrollTo('featured-projects'); onClose(); } },
    { id: 'journey', label: 'Go to Journey', icon: '🛤️', action: () => { scrollTo('journey'); onClose(); } },
    { id: 'contact', label: 'Go to Contact', icon: '✉️', action: () => { scrollTo('contact'); onClose(); } },
    { id: 'theme', label: 'Toggle Dark/Light Mode', icon: '🌓', action: () => { toggleTheme(); onClose(); } },
    { id: 'crimson', label: 'Palette: Crimson', icon: '🔴', action: () => { setPalette('crimson'); onClose(); } },
    { id: 'emerald', label: 'Palette: Emerald', icon: '🟢', action: () => { setPalette('emerald'); onClose(); } },
    { id: 'navy', label: 'Palette: Deep Navy', icon: '🔵', action: () => { setPalette('navy'); onClose(); } },
    {
      id: 'resume', label: 'Download Resume', icon: '📄',
      action: () => { window.open(personal.resumeUrl, '_blank'); onClose(); },
    },
    {
      id: 'email', label: 'Copy Email', icon: '📋',
      action: () => {
        navigator.clipboard.writeText(personal.email);
        showToast('Email copied to clipboard!');
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && filtered[activeIdx]) {
        filtered[activeIdx].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filtered, activeIdx]);

  return (
    <AnimatePresence>
      <motion.div
        className="command-palette-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="command-palette"
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            aria-label="Search commands"
          />
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: '0.5rem 0' }}>
            {filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                className={`command-item ${i === activeIdx ? 'active' : ''}`}
                onClick={cmd.action}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <span>{cmd.icon}</span>
                <span>{cmd.label}</span>
                {cmd.shortcut && <span className="shortcut">{cmd.shortcut}</span>}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                No commands found
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
