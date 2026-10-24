
import { useEffect, useRef } from "react";

export default function ParticleText() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d");

    if (!ctx || !sampleCtx) return;

    let width = 1;
    const height = 100;
    let animationId;
    let particles = [];
    let hovered = false;
    let pointer = { x: -1000, y: -1000 };
    let lastText = "";
    let lastWidth = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#67e8f9"];

    function getText() {
      return hovered ? "BUILD SOMETHING GREAT" : "BackendHub";
    }

    function buildTargets() {
      const text = getText();

      if (text === lastText && width === lastWidth) return;

      lastText = text;
      lastWidth = width;

      const sampleWidth = Math.max(1, Math.floor(width));

      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = height;

      sampleCtx.clearRect(0, 0, sampleWidth, height);

      let fontSize =
        text === "BackendHub"
          ? Math.min(48, sampleWidth / 8.5)
          : Math.min(23, sampleWidth / 14);

      fontSize = Math.max(12, fontSize);

      sampleCtx.textAlign = "center";
      sampleCtx.textBaseline = "middle";
      sampleCtx.fillStyle = "#ffffff";

      function setFont() {
        sampleCtx.font = `800 ${fontSize}px system-ui, sans-serif`;
      }

      setFont();

      while (
        sampleCtx.measureText(text).width > sampleWidth - 12 &&
        fontSize > 12
      ) {
        fontSize -= 1;
        setFont();
      }

      sampleCtx.fillText(text, sampleWidth / 2, height / 2);

      const image = sampleCtx.getImageData(
        0,
        0,
        sampleWidth,
        height,
      ).data;

      const points = [];
      const spacing = 3;

      for (let y = 5; y < height - 5; y += spacing) {
        for (let x = 3; x < sampleWidth - 3; x += spacing) {
          const index = (y * sampleWidth + x) * 4;

          if (image[index + 3] > 128) {
            points.push({ x, y });
          }
        }
      }

      const previousParticles = particles;

      particles = points.map((point, index) => {
        const old = previousParticles[index];

        return {
          x: old ? old.x : Math.random() * sampleWidth,
          y: old ? old.y : Math.random() * height,
          vx: old ? old.vx : 0,
          vy: old ? old.vy : 0,
          tx: point.x,
          ty: point.y,
          size: Math.random() * 0.6 + 1.1,
        };
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.floor(rect.width));

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      lastText = "";
      lastWidth = 0;
      buildTargets();

      if (reducedMotion) {
        animate();
      }
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();

      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;

      const inside =
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;

      if (!reducedMotion && hovered !== inside) {
        hovered = inside;
        buildTargets();
      }
    }

    function onPointerLeave() {
      pointer.x = -1000;
      pointer.y = -1000;

      if (!reducedMotion && hovered) {
        hovered = false;
        buildTargets();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Calculate cursor distance before applying particle movement.
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (reducedMotion) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
        } else {
          // Push particles away from the cursor.
          if (distance < 65 && distance > 0.1) {
            const force = Math.pow(1 - distance / 65, 2) * 4;

            p.vx -= (dx / distance) * force;
            p.vy -= (dy / distance) * force;
          }

          // Bring particles back to their target letter positions.
          p.vx += (p.tx - p.x) * 0.045;
          p.vy += (p.ty - p.y) * 0.045;

          p.vx *= 0.84;
          p.vy *= 0.84;

          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Recalculate distance after movement for accurate cursor glow.
        const glowDx = pointer.x - p.x;
        const glowDy = pointer.y - p.y;
        const glowDistance = Math.hypot(glowDx, glowDy);

        const glowRadius = 85;
        const proximity =
          !reducedMotion && glowDistance < glowRadius
            ? 1 - glowDistance / glowRadius
            : 0;

        // White particles by default; colorful glow near the cursor.
        const color =
          proximity > 0
            ? colors[
                Math.abs(Math.floor(p.x / 18)) % colors.length
              ]
            : "#ffffff";

        ctx.fillStyle = color;
        ctx.shadowBlur = proximity > 0 ? 24 * proximity : 0;
        ctx.shadowColor = color;
        ctx.globalAlpha =
          proximity > 0 ? 0.45 + proximity * 0.55 : 0.85;

        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      if (!reducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    }

    resize();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive BackendHub particle text"
      role="img"
      className="block h-[100px] w-full cursor-crosshair"
    />
  );
}
