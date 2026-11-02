import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { skillGroups } from '../data/content';

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="cell-header">In [2]:</motion.div>
          <motion.h2 variants={itemVariants} className="heading-lg" style={{ marginBottom: '1rem' }}>
            Skills & Tools
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '3rem' }}>
            # Hover to explore. Grouped by domain.
          </motion.p>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {skillGroups.map((group) => (
              <motion.div key={group.group} variants={itemVariants}>
                <h3 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ width: 12, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
                  {group.group}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={chipVariants}
                      className={`chip ${hoveredSkill === skill ? 'chip-active' : ''}`}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{ cursor: 'default' }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="cell-header" style={{ marginTop: '2rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [2]: {skillGroups.reduce((a, g) => a + g.skills.length, 0)} skills loaded
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
