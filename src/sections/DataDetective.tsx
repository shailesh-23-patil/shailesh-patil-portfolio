import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { dataDetective } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function DataDetective() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  // Auto-reveal on scroll into view after a gentle delay
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setRevealed(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  // Generate 918 dots with 172 flagged
  // Distribute the 172 flagged dots consistently
  const total = dataDetective.totalDots;
  const affected = dataDetective.affectedDots;

  // Precompute indices for deterministic layout
  const dotIndices = React.useMemo(() => {
    const isAffected = new Array(total).fill(false);
    // Evenly disperse 172 true values across 918
    const step = total / affected;
    for (let i = 0; i < affected; i++) {
      const idx = Math.floor(i * step);
      if (idx < total) isAffected[idx] = true;
    }
    return isAffected;
  }, [total, affected]);

  return (
    <section id="data-detective" className="section" ref={ref} style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div>
          <div className="cell-header">In [5]: # The Data Detective Moment</div>

          <div style={{ maxWidth: 740, margin: '0 auto 2.5rem', textAlign: 'center' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
              Catching the "Impossible Zero"
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Most modelers fill missing values with mean or median. In the 918-patient UCI Heart Disease dataset, 172 records had a serum cholesterol of 0 mg/dL — physiologically impossible in living patients.
            </p>
          </div>

          {/* Interactive Trigger */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => setRevealed(!revealed)}
              className="btn btn-outline"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                borderColor: revealed ? 'var(--accent)' : 'var(--border)',
                color: revealed ? 'var(--accent)' : 'var(--text-primary)',
              }}
            >
              {revealed ? '✓ Anomaly Highlighted (Click to Reset)' : '⚡ Click to Run Discovery Scan'}
            </button>
          </div>

          {/* 918 Dot Matrix Canvas/Grid */}
          <div
            className="dot-grid"
            style={{
              maxHeight: 260,
              overflow: 'hidden',
              padding: '1.25rem',
              borderRadius: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              marginBottom: '2rem',
            }}
          >
            {dotIndices.map((isAnomaly, i) => (
              <div
                key={i}
                className={`dot ${revealed && isAnomaly ? 'highlighted' : ''}`}
                style={{
                  transitionDelay: revealed && isAnomaly && !reducedMotion ? `${(i % 50) * 12}ms` : '0ms',
                }}
                title={isAnomaly ? 'Record with Chol = 0 mg/dL' : 'Standard record'}
              />
            ))}
          </div>

          {/* Finding Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 10 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: 720,
              margin: '0 auto',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  AFFECTED SAMPLE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                  172 / 918 (18.7%)
                </div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  ZERO CHOL PATIENTS
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                  88% Disease Rate
                </div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  STANDARD PATIENTS
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  48% Disease Rate
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Engineering Takeaway: </strong>
              The missing value was not random noise; it correlated intensely with disease prevalence. Replacing it with a mean would destroy this strong signal. Adding an explicit boolean flag boosted leak-free CV ROC-AUC to 0.93.
            </p>
          </motion.div>

          <div className="cell-header" style={{ marginTop: '2.5rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [5]: Insight surfaced: Flagged indicator beats naive imputation.
          </div>
        </div>
      </div>
    </section>
  );
}
