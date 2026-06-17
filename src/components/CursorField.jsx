import React, { useEffect, useRef } from "react";

/* A live, cursor-reactive canvas field — a constellation of nodes wired by
   proximity lines, gently drifting, that lean toward the pointer. Evokes an
   evaluation graph / neural mesh. Sits behind the hero. */
export default function CursorField({ color = "26,22,19", accent = "47,95,193" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H, dpr = Math.min(2, window.devicePixelRatio || 1);
    const mouse = { x: -9999, y: -9999 };
    let nodes = [];

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(72, Math.floor((W * H) / 16000));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * W,
        y: (Math.sin(i * 78.233) * 43758.5453 % 1 + 1) % 1 * H,
        vx: ((Math.sin(i * 3.1) ) * 0.25),
        vy: ((Math.cos(i * 2.7) ) * 0.25),
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // update
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        // gentle pull toward cursor
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) { n.x += dx * 0.008; n.y += dy * 0.008; }
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            const near = Math.min(distToMouse(a), distToMouse(b));
            const lit = near < 150;
            ctx.strokeStyle = `rgba(${lit ? accent : color},${(1 - d / 130) * (lit ? 0.5 : 0.13)})`;
            ctx.lineWidth = lit ? 1.1 : 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        const lit = distToMouse(n) < 150;
        ctx.fillStyle = `rgba(${lit ? accent : color},${lit ? 0.9 : 0.32})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, lit ? 2.6 : 1.7, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const distToMouse = (n) => Math.hypot(mouse.x - n.x, mouse.y - n.y);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [color, accent]);

  return <canvas ref={ref} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
