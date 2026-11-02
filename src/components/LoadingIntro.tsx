import { motion } from 'framer-motion';

export default function LoadingIntro() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.0, duration: 0.4, ease: 'easeOut' }}
      onAnimationComplete={(def: any) => {
        // Handled by parent removing the component
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
        }}
      >
        SP<span style={{ color: 'var(--accent)' }}>.</span>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        style={{ height: 2, background: 'var(--accent)', borderRadius: 1 }}
      />
    </motion.div>
  );
}
