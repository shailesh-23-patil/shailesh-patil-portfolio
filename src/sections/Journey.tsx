import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { education, currentlyLearning, languages, training } from '../data/content';

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="journey" className="section" ref={ref}>
      <div className="container">
        <div>
          <div className="cell-header">In [x]: # Academic Track & Trajectory</div>
          <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            Academic Journey & Trajectory
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '3rem' }}>
            # Structured education, language fluency, and continuous self-directed learning.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Timeline */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                [Education Milestones]
              </h3>

              <div className="timeline">
                {education.map((item, idx) => (
                  <motion.div
                    key={item.degree + item.year}
                    className="timeline-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.2rem' }}>
                      {item.year}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {item.degree}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                      {item.institution}
                    </div>
                    {item.detail && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                        {item.detail}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Currently Learning & Auxiliary Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Currently Learning Widget */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="pulse" />
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>
                    CURRENTLY LEARNING
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {currentlyLearning.map((topic) => (
                    <span
                      key={topic}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        background: 'hsl(var(--accent-h), var(--accent-s), var(--accent-l), 0.1)',
                        color: 'var(--accent)',
                        border: '1px solid hsl(var(--accent-h), var(--accent-s), var(--accent-l), 0.3)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      ⚡ {topic}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '1.25rem', color: 'var(--text-tertiary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Sharpening transformer foundations, semantic caching with vector stores, and containerized model serving.
                </div>
              </div>

              {/* Training & Certifications */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  TRAINING & RIGOR
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  {training} Focused on algorithmic data structures, vectorized array operations, and scikit-learn estimator architectures.
                </p>
              </div>

              {/* Languages */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  COMMUNICATION LANGUAGES
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {languages.map((l) => (
                    <span key={l} className="chip" style={{ fontSize: '0.8rem' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="cell-header" style={{ marginTop: '2.5rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [x]: Timeline recorded.
          </div>
        </div>
      </div>
    </section>
  );
}
