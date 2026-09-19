import { useEffect, useMemo, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  const particles = useMemo(() =>
    Array.from({ length: 42 }, (_, index) => ({
      x: (index * 17 % 100) / 100,
      y: (index * 31 % 100) / 100,
      radius: 1 + (index % 4) * 0.45,
      speed: 0.2 + (index % 5) * 0.12,
      alpha: 0.2 + (index % 5) * 0.05,
      phase: index * 0.8,
      hue: index % 2 === 0 ? 350 : 15
    })),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const x = (particle.x * width + Math.sin((Date.now() * 0.0005) + particle.phase + index) * 26) % width;
        const y = (particle.y * height + Math.cos((Date.now() * 0.0004) + particle.phase) * 18 + index * 1.7) % height;

        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 80%, 72%, ${particle.alpha})`;
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [particles]);

  return <canvas className="particle-background" ref={canvasRef} aria-hidden="true" />;
}
