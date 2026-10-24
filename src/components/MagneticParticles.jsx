import { useEffect, useRef } from "react";

export default function MagneticParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const PARTICLE_COUNT = 110;
    const CONNECTION_DISTANCE = 95;

    let width = 0;
    let height = 0;
    let animationId = null;
    let isVisible = !document.hidden;

    const mouse = { x: -1000, y: -1000 };
    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#67e8f9"];

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.forEach((p) => {
        p.x = Math.min(p.x, width);
        p.y = Math.min(p.y, height);
      });
    }

    function onPointerMove(event) {
      if (reducedMotion) return;

      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function onPointerLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion && mouse.x >= 0 && mouse.y >= 0) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          240
        );

        glow.addColorStop(0, "rgba(56, 189, 248, 0.12)");
        glow.addColorStop(0.45, "rgba(129, 140, 248, 0.06)");
        glow.addColorStop(1, "rgba(129, 140, 248, 0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      if (!reducedMotion) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 190 && distance > 1) {
            if (distance < 55) {
              const force = (1 - distance / 55) * 0.55;
              p.vx -= (dx / distance) * force;
              p.vy -= (dy / distance) * force;
            } else {
              const force = (1 - distance / 190) * 0.12;
              p.vx += (dx / distance) * force;
              p.vy += (dy / distance) * force;
            }
          }

          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        });
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < CONNECTION_DISTANCE) {
            const opacity =
              (1 - distance / CONNECTION_DISTANCE) * 0.3;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(103, 232, 249, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }

    function animate() {
      if (!isVisible) return;

      draw();

      if (!reducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    }

    function stopAnimation() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function startAnimation() {
      if (!isVisible || animationId !== null) return;

      if (reducedMotion) {
        draw();
        return;
      }

      animationId = requestAnimationFrame(function frame() {
        animationId = null;
        animate();
      });
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;

      if (isVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }

    resize();
    draw();

    if (!reducedMotion) {
      startAnimation();
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopAnimation();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}