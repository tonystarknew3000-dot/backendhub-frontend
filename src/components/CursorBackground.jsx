import { useEffect, useRef } from "react";

export default function CursorBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let animationId;

    const colors = [
      "255, 75, 100", // Red
      "255, 150, 60", // Orange
      "255, 225, 70", // Yellow
      "70, 220, 130", // Green
      "50, 190, 255", // Cyan
      "90, 110, 255", // Blue
      "165, 90, 255", // Violet
      "255, 90, 210", // Pink
    ];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    let particles = [];

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
  130,
  Math.max(90, Math.floor((width * height) / 8000)),
);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function handlePointerMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Move particles gently.
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }

        // Let nearby particles react to the cursor.
        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          const interactionRadius = 130;

          if (distance < interactionRadius && distance > 0) {
            const force = (interactionRadius - distance) / interactionRadius;

            particle.x += (dx / distance) * force * 1.4;
            particle.y += (dy / distance) * force * 1.4;
          }
        }
      });

      // Draw brighter connections between nearby particles.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDistance = 155;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.5;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.color}, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw brighter, larger glowing particles.
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${particle.color}, 1)`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${particle.color}, 0.9)`;
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      // Stronger cyan and violet glow around the cursor.
      if (mouse.active) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          180,
        );

        glow.addColorStop(0, "rgba(103, 232, 249, 0.18)");
        glow.addColorStop(0.5, "rgba(129, 140, 248, 0.07)");
        glow.addColorStop(1, "rgba(129, 140, 248, 0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{
        background: "transparent",
      }}
    />
  );
}
