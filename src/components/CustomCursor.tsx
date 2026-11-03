import { useEffect, useRef } from 'react';

const HOVER_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [data-cursor], .btn, .chip, .card';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hidden until the first mouse move, so it doesn't flash at (0, 0)
    dot.style.visibility = 'hidden';
    ring.style.visibility = 'hidden';

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;
    let running = false;
    let shown = false;

    const tick = () => {
      // Ring trails the dot smoothly
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      // Stop the loop once the ring has caught up (saves CPU when idle)
      if (Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!shown) {
        shown = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.visibility = 'visible';
        ring.style.visibility = 'visible';
      }

      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // Event delegation: one listener instead of one per element
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const isHoverable = !!target?.closest?.(HOVER_SELECTOR);
      document.body.classList.toggle('cursor-hover', isHoverable);
    };

    const onLeaveWindow = () => {
      dot.style.visibility = 'hidden';
      ring.style.visibility = 'hidden';
      shown = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}