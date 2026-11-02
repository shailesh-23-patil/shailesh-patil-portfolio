import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { personal, bio, heroStats } from '../data/content';

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = '', decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      current += step;
      if (frame >= steps) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Monogram Avatar ───
function MonogramAvatar() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '1rem',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.08,
          filter: 'blur(40px)',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(3rem, 5vw, 5rem)',
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '-0.03em',
          position: 'relative',
        }}
      >
        {personal.monogram}
      </span>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [photoError, setPhotoError] = useState(false);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="cell-header">In [1]:</motion.div>
          <motion.h2 variants={itemVariants} className="heading-lg" style={{ marginBottom: '3rem' }}>
            About Me
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'start' }}>
            {/* Bio */}
            <motion.div variants={itemVariants}>
              <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {bio}
              </p>

              {/* Quick facts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { icon: '📍', label: personal.location },
                  { icon: '🎓', label: 'MCA @ Vishwakarma University' },
                  { icon: '🟢', label: 'Open to opportunities' },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      padding: '0.4rem 0.8rem',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '0.5rem',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <span>{fact.icon}</span>
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Photo / Monogram */}
            <motion.div
              variants={itemVariants}
              style={{ aspectRatio: '3/4', maxWidth: 320, width: '100%', justifySelf: 'end' }}
            >
              {!photoError ? (
                <img
                  src={personal.photoUrl}
                  alt={`${personal.name} portrait`}
                  onError={() => setPhotoError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '1rem',
                    border: '1px solid var(--border)',
                  }}
                  loading="lazy"
                />
              ) : (
                <MonogramAvatar />
              )}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="cell-header" style={{ marginTop: '2rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [1]: ✓
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about .container > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
          #about .container > div > div:first-of-type > div:last-child {
            order: -1;
            max-width: 200px !important;
            justify-self: center !important;
          }
        }
      `}</style>
    </section>
  );
}
