import { useEffect, useState } from 'react';

export default function GrainOverlay() {
  const [tile, setTile] = useState('');

  useEffect(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 20;
    }
    ctx.putImageData(imageData, 0, 0);
    setTile(canvas.toDataURL('image/png'));
  }, []);

  return (
    <div
      className="grain-overlay"
      aria-hidden="true"
      style={{
        backgroundImage: tile ? `url(${tile})` : undefined,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  );
}