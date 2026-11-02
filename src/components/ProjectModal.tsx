import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../data/content';
import ProjectVisual from './ProjectVisual';

interface Props {
  project: Project | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function ProjectModal({ project, onClose, showToast }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <div className="cell-header" style={{ marginBottom: '0.25rem' }}>
                Case Study // {project.category.join(' • ')}
              </div>
              <h2 id="modal-title" className="heading-md" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ fontSize: '1.25rem', padding: '0.25rem 0.5rem' }}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Visual Canvas */}
          <div style={{ marginBottom: '1.75rem' }}>
            <ProjectVisual type={project.visualType} />
          </div>

          {/* Metrics bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {project.stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)', marginTop: '0.2rem' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Editorial Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                [Problem & Discovery]
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {project.description}
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                [Engineering Approach]
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {project.approach}
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                [Results & Evaluation]
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {project.results}
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                [Key Takeaways & Reflection]
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {project.learned}
              </p>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              TECH ARTIFACTS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {project.stack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on GitHub ↗
            </a>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Launch Demo ↗
              </a>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  padding: '0.5rem 1rem',
                  border: '1px dashed var(--border)',
                  borderRadius: '9999px',
                }}
              >
                Live demo: coming soon
              </span>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(project.repoUrl);
                showToast('Repository link copied!');
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem' }}
            >
              Copy Link
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
