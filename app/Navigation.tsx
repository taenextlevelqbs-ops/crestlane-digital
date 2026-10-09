"use client";

import { useEffect, useRef, useState } from "react";
import { iconText } from "./StudioIcons";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 701px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <div ref={root} className="navigation-shell" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button ref={toggle} type="button" className="menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open} aria-controls="main-navigation"
        onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d={open ? "M6 6l12 12M6 18 18 6" : "M4 7h16M4 12h16M4 17h16"} />
        </svg>
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <nav id="main-navigation" aria-label="Main navigation" className={open ? "navigation open" : "navigation"}>
        {[["services", "Services"], ["work", "Our work"], ["about", "About"], ["contact", "Start a project ↗"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} className={id === "contact" ? "nav-contact" : undefined}
            onClick={() => {
              setOpen(false);
              // Move focus out of the collapsing menu to the destination.
              document.getElementById(id)?.focus({ preventScroll: true });
            }}>{iconText(label)}</a>
        ))}
      </nav>
    </div>
  );
}
