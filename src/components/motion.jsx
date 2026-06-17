import React, { useEffect, useRef, useState } from "react";

/* Reveal — fade + rise as the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 24, style, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : `translateY(${y}px)`,
      transition: `opacity .7s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      willChange: "opacity, transform",
    }}>{children}</Tag>
  );
}

/* useCountUp — animate a number from 0 → target when scrolled into view. */
export function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(target * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);
  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return [ref, display];
}

/* Magnetic — subtle pointer-follow tilt on hover (used on the hero card). */
export function useMagnetic(strength = 8) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1200px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    };
    const reset = () => { el.style.transform = "perspective(1200px) rotateY(0) rotateX(0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", reset); };
  }, [strength]);
  return ref;
}
