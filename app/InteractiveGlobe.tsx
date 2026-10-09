"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveGlobe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const requestRender = useRef<() => void>(() => {});
  const angle = useRef(0.35);
  const tilt = useRef(-0.22);
  const drag = useRef<{ id: number; x: number } | null>(null);
  const paused = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selected, setSelected] = useState(0);

  const destinations = [
    {
      name: "Websites",
      heading: "Make your first impression count.",
      description: "A clear, polished website that helps people understand your business and take the next step.",
    },
    {
      name: "Software",
      heading: "Bring your operations together.",
      description: "Portals, dashboards, and registration tools built around your customers and team.",
    },
    {
      name: "Automation & AI",
      heading: "Give repetitive work a better system.",
      description: "Connect your tools, streamline follow-ups, and use AI where it helps your team.",
    },
    {
      name: "Security",
      heading: "Build on a stronger foundation.",
      description: "Practical website safeguards, access controls, updates, and backup planning.",
    },
    {
      name: "Support",
      heading: "Keep improving after launch.",
      description: "Maintenance, troubleshooting, and ongoing improvements as your needs change.",
    },
  ];

  function selectDestination(index: number) {
    setSelected(index);
    angle.current += 0.45;
    window.dispatchEvent(new CustomEvent("crestlane-service", { detail: index }));
    requestRender.current();
  }

  function exploreDestination() {
    window.dispatchEvent(new CustomEvent("crestlane-service", { detail: selected }));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("services")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }


  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let visible = true;
    let size = 500;
    let ratio = 1;

    const resize = () => {
      size = Math.max(1, el.getBoundingClientRect().width);
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(size * ratio);
      el.height = Math.round(size * ratio);
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(el);
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const onVisibility = () => { if (document.hidden) { if (frame) cancelAnimationFrame(frame); frame = 0; } else schedule(); };
    const onMotion = () => {
      paused.current = motion.matches;
      setPlaying(!motion.matches);
      setReducedMotion(motion.matches);
      schedule();
    };
    onMotion();
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);
    resize();
    requestRender.current = schedule;

    function draw(time: number) {
      frame = 0;
      if (!context || !el || !visible || document.hidden) return;
      const delta = Math.min((time - previous) / 1000 || 0, 0.04);
      previous = time;
      if (!paused.current && !motion.matches && !drag.current) {
        angle.current += delta * 0.13;
      }

      const c = context;
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      c.clearRect(0, 0, size, size);
      const center = size / 2;
      const radius = size * 0.305;

      const glow = c.createRadialGradient(center, center, radius * 0.5,
        center, center, size * 0.49);
      glow.addColorStop(0, "#536ee640");
      glow.addColorStop(0.65, "#5b5fd519");
      glow.addColorStop(1, "#536ee600");
      c.fillStyle = glow;
      c.fillRect(0, 0, size, size);

      function ring(rotation: number, color: string) {
        c.save();
        c.translate(center, center);
        c.rotate(rotation);
        c.strokeStyle = color;
        c.lineWidth = 1;
        c.beginPath();
        c.ellipse(0, 0, radius * 1.43, radius * 0.48, 0, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }
      ring(-0.45, "#a9bdff50");
      ring(0.85, "#85e9ef28");

      const sphere = c.createRadialGradient(
        center - radius * 0.5, center - radius * 0.6, 0,
        center + radius * 0.18, center + radius * 0.2, radius * 1.15
      );
      sphere.addColorStop(0, "#b6c8ff");
      sphere.addColorStop(0.2, "#586db1");
      sphere.addColorStop(0.58, "#15294c");
      sphere.addColorStop(1, "#040814");
      c.beginPath();
      c.arc(center, center, radius, 0, Math.PI * 2);
      c.fillStyle = sphere;
      c.fill();

      function project(lat: number, lon: number) {
        const x = Math.cos(lat) * Math.sin(lon + angle.current);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lon + angle.current);
        const yy = y * Math.cos(tilt.current) - z * Math.sin(tilt.current);
        const zz = y * Math.sin(tilt.current) + z * Math.cos(tilt.current);
        return { x: center + x * radius, y: center - yy * radius, z: zz };
      }
      function line(points: { x: number; y: number; z: number }[]) {
        c.beginPath();
        let open = false;
        for (const p of points) {
          if (p.z < 0) { open = false; continue; }
          if (open) c.lineTo(p.x, p.y);
          else { c.moveTo(p.x, p.y); open = true; }
        }
        c.stroke();
      }
      c.save();
      c.beginPath();
      c.arc(center, center, radius - 0.5, 0, Math.PI * 2);
      c.clip();
      c.strokeStyle = "#a6ebff32";
      c.lineWidth = 0.8;
      for (let lat = -60; lat <= 60; lat += 20) {
        line(Array.from({ length: 121 }, (_, i) =>
          project(lat * Math.PI / 180, i * Math.PI / 60)));
      }
      for (let lon = 0; lon < 360; lon += 20) {
        line(Array.from({ length: 81 }, (_, i) =>
          project(-Math.PI / 2 + i * Math.PI / 80, lon * Math.PI / 180)));
      }

      for (let i = 0; i < 28; i++) {
        const lat = Math.asin(1 - 2 * (i + 0.5) / 28);
        const lon = i * 2.399963;
        const p = project(lat, lon);
        if (p.z <= 0) continue;
        c.globalAlpha = 0.3 + p.z * 0.65;
        c.fillStyle = "#a8f5ff";
        c.shadowColor = "#82eaff";
        c.shadowBlur = 9;
        c.beginPath();
        c.arc(p.x, p.y, size * 0.0035, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
      c.globalAlpha = 1;
      c.shadowBlur = 0;
      c.strokeStyle = "#c4d9ff65";
      c.lineWidth = 1;
      c.beginPath();
      c.arc(center, center, radius, 0, Math.PI * 2);
      c.stroke();

      const orbitAngle = angle.current * 1.8;
      c.save();
      c.translate(center, center);
      c.rotate(-0.45);
      c.fillStyle = "#bafaff";
      c.shadowColor = "#9defff";
      c.shadowBlur = 18;
      c.beginPath();
      c.arc(Math.cos(orbitAngle) * radius * 1.43,
        Math.sin(orbitAngle) * radius * 0.48, size * 0.006, 0, Math.PI * 2);
      c.fill();
      c.restore();
      if (!paused.current && !motion.matches && !drag.current) schedule();
    }

    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      requestRender.current = () => {};
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      observer.disconnect();
      intersection.disconnect();
    };
  }, []);

  return (
    <div className="space-scene studio-globe">
      <div className="globe-surface" tabIndex={0} role="group" aria-roledescription="interactive globe"
        aria-label="Interactive digital globe. Drag horizontally or use left and right arrow keys to rotate."
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          drag.current = { id: event.pointerId, x: event.clientX };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current?.id === event.pointerId) {
            angle.current += (event.clientX - drag.current.x) * 0.012;
            drag.current.x = event.clientX;
            requestRender.current();
          } else if (event.pointerType === "mouse") {
            const rect = event.currentTarget.getBoundingClientRect();
            tilt.current = -0.22 + ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
            requestRender.current();
          }
        }}
        onPointerUp={() => { drag.current = null; requestRender.current(); }}
        onPointerCancel={() => { drag.current = null; requestRender.current(); }}
        onLostPointerCapture={() => { drag.current = null; requestRender.current(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            angle.current += event.key === "ArrowRight" ? 0.2 : -0.2;
            requestRender.current();
          }
        }}>
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      
      <div className="globe-service-console">
        <p className="globe-purpose-label">YOUR NEXT MOVE STARTS HERE</p>
        <h2>What would you like to build?</h2>
        <div className="globe-destinations" role="group" aria-label="Choose a Crestlane service">
          {destinations.map((destination, index) => (
            <button
              type="button"
              key={destination.name}
              aria-pressed={selected === index}
              aria-controls="globe-destination-preview"
              onClick={() => selectDestination(index)}
            >
              <span className="destination-light" aria-hidden="true" />
              {destination.name}
            </button>
          ))}
        </div>
        <div id="globe-destination-preview" className="globe-destination-preview"
          aria-live="polite" aria-atomic="true">
          <span className="destination-category">{destinations[selected].name}</span>
          <h3>{destinations[selected].heading}</h3>
          <p>{destinations[selected].description}</p>
        </div>
        <button type="button" className="globe-explore-button"
          onClick={exploreDestination}>
          Explore this service
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true" focusable="false">
            <path d="M4 12h16m-7-7 7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="globe-controls">
        <span>DRAG TO EXPLORE</span>
        <button type="button" aria-pressed={!playing} disabled={reducedMotion}
          onClick={() => {
            paused.current = !paused.current;
            setPlaying(!paused.current);
            requestRender.current();
          }}>
          {reducedMotion ? "Motion reduced" : playing ? "Pause rotation" : "Resume rotation"}
        </button>
      </div>
    </div>
  );
}
