import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects, filterCategories, type Project } from '../data/content';
import ProjectVisual from '../components/ProjectVisual';
import ProjectModal from '../components/ProjectModal';

interface Props {
  showToast: (msg: string) => void;
}

export default function AllProjects({ showToast }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.includes(activeCategory as any));

  return (
    <section id="all-projects" className="section" ref={ref}>
      <div className="container">
        <div>
          <div className="cell-header">In [4]:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
                All Projects
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                # Select category to filter {projects.length} repository builds
              </p>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }} role="tablist">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`chip ${activeCategory === cat ? 'chip-active' : ''}`}
                  style={{ cursor: 'pointer', padding: '0.35rem 0.85rem' }}
                  role="tab"
                  aria-selected={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Projects */}
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filtered.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => setSelectedProject(p)}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <ProjectVisual type={p.visualType} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)' }}>
                      {p.category.join(' / ')}
                    </span>
                    {p.featured && (
                      <span className="status-badge" style={{ padding: '0.1rem 0.4rem', fontSize: '0.6rem' }}>
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3 className="heading-sm" style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {p.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.5, marginBottom: '1rem', flexGrow: 1 }}>
                    {p.summary}
                  </p>

                  {/* Impact Stats */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {p.stats.slice(0, 2).map((s) => (
                      <span
                        key={s.label}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                        }}
                      >
                        <span style={{ color: 'var(--text-tertiary)' }}>{s.label}:</span>{' '}
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.value}</span>
                      </span>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                    {p.stack.slice(0, 4).map((t) => (
                      <span key={t} className="chip" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {t}
                      </span>
                    ))}
                    {p.stack.length > 4 && (
                      <span className="chip" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', color: 'var(--text-tertiary)' }}>
                        +{p.stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.75rem',
                      marginTop: 'auto',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', fontFamily: 'var(--font-mono)' }}
                    >
                      Repo ↗
                    </a>
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ fontSize: '0.75rem', color: 'var(--accent)' }}
                      >
                        Live Demo
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                        Demo soon
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="cell-header" style={{ marginTop: '2.5rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [4]: Showing {filtered.length} of {projects.length} repositories.
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        showToast={showToast}
      />
    </section>
  );
}
