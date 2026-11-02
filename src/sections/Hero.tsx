import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { personal, heroTypingLines } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  scrollTo: (id: string) => void;
}

// ─── Particle Network Canvas ───
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let mouseX = -1000, mouseY = -1000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const getAccent = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent').trim() || 'hsl(0, 72%, 50%)';
    };

    // Determine particle count based on screen size
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const accent = getAccent();

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= dx * 0.00005;
          p.vy -= dy * 0.00005;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });

      // Connection lines
      const maxDist = isMobile ? 100 : 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = 0.15 * (1 - d / maxDist);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

// ─── Text Scramble Effect ───
function useTextScramble(text: string, duration = 800) {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.ceil(duration / 16);
    let id: number;

    const update = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(result);
      if (frame < totalFrames) {
        id = requestAnimationFrame(update);
      }
    };
    id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [text, duration]);

  return display;
}

// ─── Typing Effect ───
function TypingLine({ lines }: { lines: string[] }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const line = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < line.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), 50);
    } else if (!deleting && charIdx === line.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), 25);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx((lineIdx + 1) % lines.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx, lines]);

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)', color: 'var(--text-secondary)' }}>
      <span style={{ color: 'var(--accent)', marginRight: '0.5rem' }}>{'>'}</span>
      {lines[lineIdx].substring(0, charIdx)}
      <span style={{ borderRight: '2px solid var(--accent)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </span>
  );
}

export default function Hero({ scrollTo }: Props) {
  const scrambledName = useTextScramble(personal.name, 1000);
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleCanvas />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '4rem' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 800 }}
        >
          {/* Cell header */}
          <motion.div variants={itemVariants} className="cell-header">
            In [0]:
          </motion.div>

          {/* Status badge */}
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <div className="status-badge">
              <span className="pulse" />
              {personal.statusBadge}
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="heading-xl"
            style={{ marginBottom: '1rem' }}
          >
            {reducedMotion ? personal.name : scrambledName}
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              maxWidth: 600,
            }}
          >
            {personal.title}
          </motion.p>

          {/* Typing line */}
          <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem', minHeight: '1.5rem' }}>
            <TypingLine lines={heroTypingLines} />
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}
          >
            <button onClick={() => scrollTo('featured-projects')} className="btn btn-primary">
              View Projects
            </button>
            <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              📄 Download Resume
            </a>
            <button onClick={() => scrollTo('contact')} className="btn btn-outline">
              Contact Me
            </button>
          </motion.div>

          {/* Out cell */}
          <motion.div variants={itemVariants} className="cell-header" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [0]: Ready.
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 24, background: 'var(--accent)', opacity: 0.5 }}
        />
      </motion.div>
    </section>
  );
}
