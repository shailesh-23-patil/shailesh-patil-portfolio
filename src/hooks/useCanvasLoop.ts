import { useEffect, useRef } from "react";

export function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void,
  opts: { fps?: number; maxDpr?: number } = {}
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fps = 60, maxDpr = 1.5 } = opts;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const frameMs = 1000 / fps;
    let raf = 0, last = 0, visible = false, w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < frameMs) return;
      last = t;
      draw(ctx, t, w, h);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible && !document.hidden ? start() : stop();
    });
    io.observe(canvas);

    const onVis = () => (visible && !document.hidden ? start() : stop());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [draw, fps, maxDpr]);

  return canvasRef;
}