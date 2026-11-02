import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects, type Project } from '../data/content';
import ProjectVisual from '../components/ProjectVisual';
import ProjectModal from '../components/ProjectModal';

interface Props {
  showToast: (msg: string) => void;
}

export default function FeaturedProjects({ showToast }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);

  return (
    <section id="featured-projects" className="section" ref={ref}>
      <div className="container">
        <div>
          <div className="cell-header">In [3]:</div>
          <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            Featured Case Studies
          </h2>
          <p
            style={{
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              marginBottom: '3rem',
            }}
          >
            # Deep-dive projects highlighting data hygiene, RAG architectures, and leak-free ML.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {featured.map((p, idx) => (
              <motion.article
                key={p.id}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedProject(p)}
              >
                {/* Visual half */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ProjectVisual type={p.visualType} />
                </div>

                {/* Narrative half */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="status-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}>
                        FEATURED [0{idx + 1}]
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {p.category.join(' • ')}
                      </span>
                    </div>

                    <h3 className="heading-md" style={{ marginBottom: '0.75rem' }}>
                      {p.title}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {p.summary}
                    </p>

                    {/* Impact stats pill row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
                      {p.stats.map((s) => (
                        <div
                          key={s.label}
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <span style={{ color: 'var(--text-tertiary)' }}>{s.label}: </span>
                          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {p.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      GitHub Repo ↗
                    </a>
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        Live Demo ↗
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--text-tertiary)',
                          padding: '0.4rem 0.8rem',
                          border: '1px dashed var(--border)',
                          borderRadius: '9999px',
                        }}
                      >
                        Live demo: coming soon
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginLeft: 'auto' }}
                    >
                      Read Case Study →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="cell-header" style={{ marginTop: '2.5rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [3]: 4 Case Studies compiled successfully.
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
