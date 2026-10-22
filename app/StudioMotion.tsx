"use client";
import { useEffect } from "react";

// Short entrance motion only. Content stays visible without JS or animation.
export default function StudioMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const start = () => {
      observer?.disconnect();
      document.querySelectorAll(".studio-enter").forEach(el => el.classList.remove("studio-enter"));
      if (media.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("studio-enter");
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08 });
      document.querySelectorAll(".section-heading, .project-card, .studio-services, .connected-panel, .about-copy, .hub-cards, .inquiry-panel")
        .forEach(el => observer?.observe(el));
    };
    start();
    media.addEventListener("change", start);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", start);
      document.querySelectorAll(".studio-enter").forEach(el => el.classList.remove("studio-enter"));
    };
  }, []);
  return null;
}
