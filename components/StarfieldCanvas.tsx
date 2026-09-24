import React, { useEffect, useRef } from "react";

interface Star3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  colorType: "gold" | "blue" | "white" | "stardust";
  twinkleFreq: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  color: string;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let focalLength = 800;

    const MAX_DEPTH = 1500;
    const STAR_COUNT = 1400;
    const SPEED = 0.55;

    // Color palette matching the simulation's warm gold and celestial blue aesthetic
    const colors = {
      gold: { r: 240, g: 218, b: 140 },
      blue: { r: 164, g: 198, b: 232 },
      white: { r: 255, g: 255, b: 255 },
      stardust: { r: 216, g: 188, b: 114 },
    };

    const colorTypes: Star3D["colorType"][] = [
      "gold",
      "blue",
      "white",
      "white",
      "stardust",
    ];

    // Initialize 3D stars
    const stars: Star3D[] = [];
    const initStars = () => {
      stars.length = 0;
      const spreadX = Math.max(width * 1.5, 1200);
      const spreadY = Math.max(height * 1.5, 900);

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,
          z: Math.random() * MAX_DEPTH + 1,
          baseRadius: Math.random() * 1.4 + 0.5,
          colorType: colorTypes[Math.floor(Math.random() * colorTypes.length)],
          twinkleFreq: Math.random() * 2 + 1,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + 2000;

    const spawnShootingStar = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.35; // ~45 deg downward slope
      const speed = Math.random() * 9 + 11;
      const length = Math.random() * 90 + 70;
      const maxLife = Math.random() * 40 + 35;
      const startX = Math.random() * (width * 0.9);
      const startY = Math.random() * (height * 0.4);

      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 0,
        maxLife,
        color: Math.random() > 0.4 ? "#f3e1af" : "#c6ddf3",
      });
    };

    // Responsive resize handler
    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      cx = width / 2;
      cy = height / 2;
      focalLength = Math.max(width, height) * 0.72;

      if (stars.length === 0) {
        initStars();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    // Animation Loop
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const timeSec = now * 0.001;

      // 1. Deep Cosmic Space Background with Atmospheric Gradients
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#06080e");
      bgGrad.addColorStop(0.5, "#080b12");
      bgGrad.addColorStop(1, "#040508");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Cosmic Nebula Clouds (Deep Navy, Ethereal Amethyst, Gold Stardust)
      // Top-right stardust glow
      const goldNebula = ctx.createRadialGradient(
        width * 0.78,
        height * 0.28,
        0,
        width * 0.78,
        height * 0.28,
        width * 0.48
      );
      goldNebula.addColorStop(0, "rgba(216, 188, 114, 0.065)");
      goldNebula.addColorStop(0.5, "rgba(143, 168, 189, 0.035)");
      goldNebula.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = goldNebula;
      ctx.fillRect(0, 0, width, height);

      // Bottom-left deep indigo haze
      const blueNebula = ctx.createRadialGradient(
        width * 0.22,
        height * 0.75,
        0,
        width * 0.22,
        height * 0.75,
        width * 0.55
      );
      blueNebula.addColorStop(0, "rgba(23, 44, 78, 0.14)");
      blueNebula.addColorStop(0.6, "rgba(10, 18, 35, 0.05)");
      blueNebula.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = blueNebula;
      ctx.fillRect(0, 0, width, height);

      // Center subtle celestial aura
      const centerGlow = ctx.createRadialGradient(
        cx,
        cy - 40,
        0,
        cx,
        cy - 40,
        width * 0.38
      );
      centerGlow.addColorStop(0, "rgba(180, 160, 110, 0.038)");
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Render 3D Projected Star Field
      const spreadX = Math.max(width * 1.5, 1200);
      const spreadY = Math.max(height * 1.5, 900);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star forward through z space
        star.z -= SPEED * 60 * delta;

        // Subtle gentle drift
        star.x += Math.sin(timeSec * 0.2 + star.twinklePhase) * 0.04;
        star.y += Math.cos(timeSec * 0.15 + star.twinklePhase) * 0.03;

        // Reset if behind camera or past horizon
        if (star.z <= 1) {
          star.z = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * spreadX;
          star.y = (Math.random() - 0.5) * spreadY;
        }

        // Perspective 3D projection
        const scale = focalLength / star.z;
        const screenX = cx + star.x * scale;
        const screenY = cy + star.y * scale;

        // Check if inside screen boundaries with a small margin
        if (
          screenX < -20 ||
          screenX > width + 20 ||
          screenY < -20 ||
          screenY > height + 20
        ) {
          if (star.z < 200) {
            // Recycle when going out of bounds near viewer
            star.z = MAX_DEPTH;
            star.x = (Math.random() - 0.5) * spreadX;
            star.y = (Math.random() - 0.5) * spreadY;
          }
          continue;
        }

        // Depth & Twinkle Alpha
        const depthAlpha = Math.min(Math.max((MAX_DEPTH - star.z) / MAX_DEPTH, 0.1), 0.95);
        const twinkle = 0.65 + 0.35 * Math.sin(timeSec * star.twinkleFreq + star.twinklePhase);
        const alpha = depthAlpha * twinkle;

        const radius = Math.max(star.baseRadius * scale, 0.45);
        const c = colors[star.colorType];

        // Draw star
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // Subtle bloom for prominent stars close to camera
        if (radius > 1.3 && alpha > 0.45) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${(alpha * 0.18).toFixed(3)})`;
          ctx.fill();
        }
      }

      // 4. Shooting Stars
      if (Date.now() > nextShootingStarTime) {
        spawnShootingStar();
        nextShootingStarTime = Date.now() + Math.random() * 5000 + 3500;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.dx;
        s.y += s.dy;
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.85;

        // Tail gradient
        const tailX = s.x - (s.dx / s.speed) * s.length;
        const tailY = s.y - (s.dy / s.speed) * s.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        meteorGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        meteorGrad.addColorStop(0.7, s.color === "#f3e1af" ? "rgba(216, 188, 114, 0.4)" : "rgba(164, 198, 232, 0.4)");
        meteorGrad.addColorStop(1, s.color);

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Meteor head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.fill();

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
