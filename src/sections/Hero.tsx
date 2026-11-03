import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { personal, heroTypingLines } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  scrollTo: (id: string) => void;
}

// ─── Helpers ───
const readAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
  'hsl(0, 72%, 50%)';

// ─── Particle Network Canvas ───
// Optimizations vs. the original:
//  • runs ONLY while the hero is on screen and the tab is visible
//  • accent color is cached (not read from the DOM every frame)
//  • no sqrt for most particle pairs; lines are drawn in 4 batches, not one stroke each
//  • canvas resolution capped (retina screens don't draw 4x the pixels)
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;
    const maxDist = isMobile ? 100 : 140;
    const maxDistSq = maxDist * maxDist;
    const BUCKETS = 4;
    const MAX_SPEED = 1.5;

    let w = 0;
    let h = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let raf = 0;
    let running = false;
    let visible = false;
    let accent = readAccent();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width || window.innerWidth;
      h = rect.height || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));

    const render = () => {
      raf = requestAnimationFrame(render);
      ctx.clearRect(0, 0, w, h);

      // Move + mouse interaction
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        if (dx * dx + dy * dy < 22500) {
          p.vx -= dx * 0.00005;
          p.vy -= dy * 0.00005;
        }
        // keep speeds sane
        if (p.vx > MAX_SPEED) p.vx = MAX_SPEED;
        else if (p.vx < -MAX_SPEED) p.vx = -MAX_SPEED;
        if (p.vy > MAX_SPEED) p.vy = MAX_SPEED;
        else if (p.vy < -MAX_SPEED) p.vy = -MAX_SPEED;
      }

      // All dots in ONE fill call
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = accent;
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Connection lines, grouped into alpha buckets (4 strokes instead of hundreds)
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < maxDistSq) {
            const d = Math.sqrt(dSq);
            const k = Math.min(BUCKETS - 1, Math.floor((d / maxDist) * BUCKETS));
            paths[k].moveTo(a.x, a.y);
            paths[k].lineTo(b.x, b.y);
          }
        }
      }
      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.5;
      for (let k = 0; k < BUCKETS; k++) {
        ctx.globalAlpha = 0.15 * (1 - (k + 0.5) / BUCKETS);
        ctx.stroke(paths[k]);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    // Pause when scrolled away or tab hidden
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    // Refresh cached accent only when theme/palette actually changes
    const mo = new MutationObserver(() => {
      accent = readAccent();
    });
    const moOpts = { attributes: true, attributeFilter: ['data-theme', 'data-palette', 'class', 'style'] };
    mo.observe(document.documentElement, moOpts);
    mo.observe(document.body, moOpts);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

// ─── Text Scramble Effect ───
// Lives in its own component so only this tiny piece re-renders (not the whole Hero),
// updates ~20 times/sec instead of 60, and starts when the heading actually fades in.
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

function scramble(text: string, revealed: number) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    if (i < revealed || text[i] === ' ') {
      result += text[i];
    } else {
      result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
  }
  return result;
}

function ScrambledText({ text, duration = 1000, delay = 600 }: { text: string; duration?: number; delay?: number }) {
  const [display, setDisplay] = useState(() => scramble(text, 0));

  useEffect(() => {
    let raf = 0;
    let startTime = 0;
    let lastUpdate = 0;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      if (now - lastUpdate >= 50 || progress === 1) {
        lastUpdate = now;
        setDisplay(scramble(text, Math.floor(progress * text.length)));
      }
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, duration, delay]);

  return <>{display}</>;
}

// ─── Typing Effect ───
// The keyframes <style> is created once at module level (same element reference every render),
// so React no longer re-injects a <style> tag on every keystroke.
const blinkStyle = <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>;

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
      {blinkStyle}
    </span>
  );
}

// ─── Hero ───
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

export default function Hero({ scrollTo }: Props) {
  const reducedMotion = useReducedMotion();

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
            {reducedMotion ? personal.name : <ScrambledText text={personal.name} />}
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