import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  type: string;
}

export default function ProjectVisual({ type }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    let isVisible = true;

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue('--accent').trim() || '#e11d48';
      const textSecondary = style.getPropertyValue('--text-secondary').trim() || '#a1a1aa';
      const border = style.getPropertyValue('--border').trim() || '#27272a';
      const bgCard = style.getPropertyValue('--bg-card').trim() || '#141416';
      return { accent, textSecondary, border, bgCard };
    };

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      frame++;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const { accent, textSecondary, border } = getColors();
      ctx.clearRect(0, 0, w, h);

      // ─── 1. ECG Pulse Line (Heart Disease) ───
      if (type === 'ecg') {
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        // Background subtle grid
        for (let x = 0; x < w; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 24) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        const midY = h / 2;
        const speed = reducedMotion ? 0 : (frame * 2) % (w + 120);

        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';

        for (let x = 0; x < w; x += 2) {
          const relX = (x + speed) % (w + 120);
          let y = midY;

          // Pulse waves interrupted by abnormal "0 cholesterol flatline"
          if (relX > 60 && relX < 110) {
            const p = (relX - 60) / 50;
            if (p < 0.2) y -= 12 * Math.sin(p * Math.PI * 5);
            else if (p < 0.5) y += 38 * Math.sin((p - 0.2) * Math.PI * 3.33);
            else if (p < 0.8) y -= 55 * Math.sin((p - 0.5) * Math.PI * 3.33);
            else y += 18 * Math.sin((p - 0.8) * Math.PI * 5);
          } else if (relX >= 180 && relX <= 260) {
            // Flatline at "0" indicator
            y = midY;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 0-Marker Annotation
        ctx.fillStyle = accent;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('FLAG: CHOL=0 (18.7%)', 20, 24);
        ctx.fillStyle = textSecondary;
        ctx.fillText('LEAK-FREE 5-CV ROC 0.93', 20, 40);
      }

      // ─── 2. CampusGPT (RAG Doc Chunks to Vector Nodes) ───
      else if (type === 'rag') {
        const nodes = [
          { x: w * 0.2, y: h * 0.35, label: 'Doc Chunks' },
          { x: w * 0.45, y: h * 0.5, label: 'Gemini Embed' },
          { x: w * 0.72, y: h * 0.35, label: 'FAISS Top-K' },
          { x: w * 0.85, y: h * 0.72, label: 'Cited Ans' },
        ];

        // Draw connections
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        nodes.forEach((n, idx) => {
          if (idx === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        });
        ctx.stroke();

        // Animated packet along RAG path
        if (!reducedMotion) {
          const t = (frame % 120) / 120;
          let px = w * 0.2;
          let py = h * 0.35;
          if (t < 0.33) {
            const sub = t / 0.33;
            px = nodes[0].x + (nodes[1].x - nodes[0].x) * sub;
            py = nodes[0].y + (nodes[1].y - nodes[0].y) * sub;
          } else if (t < 0.66) {
            const sub = (t - 0.33) / 0.33;
            px = nodes[1].x + (nodes[2].x - nodes[1].x) * sub;
            py = nodes[1].y + (nodes[2].y - nodes[1].y) * sub;
          } else {
            const sub = (t - 0.66) / 0.34;
            px = nodes[2].x + (nodes[3].x - nodes[2].x) * sub;
            py = nodes[2].y + (nodes[3].y - nodes[2].y) * sub;
          }
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw nodes
        nodes.forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();

          ctx.fillStyle = textSecondary;
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + 18);
        });
      }

      // ─── 3. Digit CNN (28x28 MNIST grid + 10-bar probability settling) ───
      else if (type === 'digit') {
        const gridSize = 14;
        const startX = 24;
        const startY = h / 2 - (gridSize * 7) / 2;
        const cellSize = 6;

        // Draw small 14x14 sampled grid
        ctx.strokeStyle = border;
        ctx.lineWidth = 0.5;
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            // Draw a stylized digit '7' pattern
            const isDigit = (r === 2 && c >= 2 && c <= 11) || (r > 2 && c === 12 - r);
            ctx.fillStyle = isDigit ? accent : 'transparent';
            ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1);
          }
        }

        // Arrow to softmax bars
        ctx.fillStyle = textSecondary;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('CNN →', startX + gridSize * cellSize + 15, h / 2 + 4);

        // Softmax bar charts
        const barStartX = startX + gridSize * cellSize + 70;
        const barW = Math.max(60, w - barStartX - 40);
        const probs = [0.01, 0.02, 0.01, 0.01, 0.03, 0.01, 0.01, 0.9912, 0.01, 0.02];
        const barH = 7;
        const gap = 3;
        const chartStartY = h / 2 - ((barH + gap) * 10) / 2;

        probs.forEach((p, idx) => {
          const cy = chartStartY + idx * (barH + gap);
          ctx.fillStyle = textSecondary;
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`${idx}`, barStartX - 14, cy + 6);

          // Background track
          ctx.fillStyle = border;
          ctx.fillRect(barStartX, cy, barW, barH);

          // Value bar
          ctx.fillStyle = idx === 7 ? accent : textSecondary;
          ctx.fillRect(barStartX, cy, barW * p, barH);
        });

        ctx.fillStyle = accent;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('99.12% Test Acc (MNIST)', barStartX, chartStartY - 8);
      }

      // ─── 4. Diabetes (Random Forest Branching Trees Voting) ───
      else if (type === 'forest') {
        const trees = [w * 0.22, w * 0.5, w * 0.78];
        const rootY = h * 0.28;

        trees.forEach((tx, tIdx) => {
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;

          // Root node
          ctx.beginPath();
          ctx.arc(tx, rootY, 4, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();

          // Branches Level 1
          const b1 = [-22, 22];
          b1.forEach((off, i) => {
            const bx = tx + off;
            const by = rootY + 30;
            ctx.beginPath();
            ctx.moveTo(tx, rootY);
            ctx.lineTo(bx, by);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();

            // Branches Level 2
            const b2 = [-10, 10];
            b2.forEach((subOff) => {
              const sx = bx + subOff;
              const sy = by + 28;
              ctx.beginPath();
              ctx.moveTo(bx, by);
              ctx.lineTo(sx, sy);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = (i + tIdx) % 2 === 0 ? accent : textSecondary;
              ctx.fill();
            });
          });
        });

        ctx.fillStyle = textSecondary;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Ensemble Decision Trees (100K Records)', w / 2, h - 20);
        ctx.fillStyle = accent;
        ctx.fillText('ROC-AUC: 94.13% | Prec: 99.94%', w / 2, h - 36);
      }

      // ─── 5. Ford Car Scatter & Regression Line ───
      else if (type === 'scatter') {
        const pad = 36;
        const gw = w - pad * 2;
        const gh = h - pad * 2;

        // Axes
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, pad);
        ctx.lineTo(pad, h - pad);
        ctx.lineTo(w - pad, h - pad);
        ctx.stroke();

        // Synthetic scatter points
        const points = [
          [0.1, 0.15], [0.15, 0.22], [0.2, 0.18], [0.25, 0.3], [0.32, 0.35],
          [0.38, 0.42], [0.45, 0.48], [0.52, 0.5], [0.6, 0.65], [0.68, 0.62],
          [0.74, 0.76], [0.8, 0.82], [0.86, 0.85], [0.92, 0.94],
        ];

        points.forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(pad + px * gw, h - pad - py * gh, 3, 0, Math.PI * 2);
          ctx.fillStyle = textSecondary;
          ctx.fill();
        });

        // Dynamic tightening regression line
        const r2Progress = reducedMotion ? 1 : (Math.sin(frame * 0.03) + 1) / 2;
        const r2 = (0.85 + r2Progress * 0.07).toFixed(2);

        ctx.beginPath();
        ctx.moveTo(pad, h - pad - 0.1 * gh);
        ctx.lineTo(w - pad, h - pad - 0.92 * gh);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = accent;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`R² = ${r2} (17,966 records)`, pad + 10, pad + 18);
        ctx.fillStyle = textSecondary;
        ctx.fillText('1-hot encoded > Label encoded', pad + 10, pad + 32);
      }

      // ─── 6. Insurance (Split Bar Chart Smoker vs Non-Smoker 3.8x) ───
      else if (type === 'splitbar') {
        const barW = 48;
        const baseH = h - 60;
        const c1X = w * 0.35;
        const c2X = w * 0.65;

        // Non-smoker: $8,441 (relative height: 0.25)
        const h1 = baseH * 0.24;
        ctx.fillStyle = border;
        ctx.fillRect(c1X - barW / 2, h - 40 - h1, barW, h1);

        // Smoker: $32,050 (3.8x, relative height: 0.91)
        const h2 = baseH * 0.88;
        ctx.fillStyle = accent;
        ctx.fillRect(c2X - barW / 2, h - 40 - h2, barW, h2);

        ctx.fillStyle = textSecondary;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Non-Smoker', c1X, h - 22);
        ctx.fillText('$8,441', c1X, h - 40 - h1 - 8);

        ctx.fillStyle = accent;
        ctx.fillText('Smoker (3.8x)', c2X, h - 22);
        ctx.fillText('$32,050', c2X, h - 40 - h2 - 8);

        ctx.fillStyle = textSecondary;
        ctx.fillText('Smoker × Obese interaction feature → R²: 0.86', w / 2, 24);
      }

      // ─── 7. Retail Dashboard (Mini Trends + Bars) ───
      else if (type === 'dashboard') {
        const padX = 24;
        const padY = 24;
        const dw = w - padX * 2;

        // Mini KPI cards row
        const kpiW = (dw - 16) / 3;
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = border;
          ctx.strokeRect(padX + i * (kpiW + 8), padY, kpiW, 30);
        }
        ctx.fillStyle = accent;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('1,000 TXN', padX + 6, padY + 18);
        ctx.fillText('MAY PEAK', padX + kpiW + 14, padY + 18);
        ctx.fillText('ELECTRONICS', padX + (kpiW + 8) * 2 + 6, padY + 18);

        // Bars
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const values = [0.35, 0.42, 0.5, 0.65, 0.95, 0.72, 0.58];
        const bw = dw / (months.length * 2);

        months.forEach((m, idx) => {
          const bx = padX + idx * (bw * 2) + bw / 2;
          const bh = (h - 90) * values[idx];
          ctx.fillStyle = idx === 4 ? accent : border;
          ctx.fillRect(bx, h - 30 - bh, bw, bh);

          ctx.fillStyle = textSecondary;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(m, bx + bw / 2, h - 14);
        });
      }

      // ─── 8. Momo Dragon (Menu Card & Ticket Motif) ───
      else if (type === 'menu') {
        const cardW = Math.min(220, w * 0.75);
        const cardH = Math.min(120, h * 0.65);
        const cx = (w - cardW) / 2;
        const cy = (h - cardH) / 2;

        // Order ticket background
        ctx.strokeStyle = border;
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.strokeRect(cx, cy, cardW, cardH);
        ctx.fillRect(cx, cy, cardW, cardH);

        // Header
        ctx.fillStyle = accent;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ORDER TICKET #1042', cx + 12, cy + 22);

        // Items
        ctx.fillStyle = textSecondary;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('Steamed Momo x 2 ...... ₹180', cx + 12, cy + 42);
        ctx.fillText('Dragon Sauce x 1 ...... ₹40', cx + 12, cy + 58);
        ctx.fillText('JWT Auth Verified [OK]', cx + 12, cy + 78);

        // Status badge
        ctx.strokeStyle = accent;
        ctx.strokeRect(cx + cardW - 74, cy + 12, 62, 16);
        ctx.fillStyle = accent;
        ctx.fillText('DISPATCHED', cx + cardW - 70, cy + 23);
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [type, reducedMotion]);

  return (
    <div className="project-visual">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
