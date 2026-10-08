"use client";

import { useState } from "react";
import { Arrow } from "./StudioIcons";

type Service = {
  title: string;
  copy: string;
  examples: string;
  details: string[];
  outcome: string;
};

const labels = ["Websites", "Software & portals", "Automation & AI", "Website security", "Ongoing support"];

export default function ServiceExplorer({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const service = services[active];
  if (!service) return null;

  return (
    <div className="studio-services">
      <div className="studio-service-picker" aria-label="Explore services">
        <p className="studio-small-label">CHOOSE YOUR NEXT MOVE</p>
        {services.map((item, index) => (
          <button type="button" key={item.title} aria-pressed={active === index}
            aria-controls="studio-service-detail"
            onClick={() => setActive(index)}>
            <span className="studio-service-number">0{index + 1}</span>
            <span>{labels[index] || item.title}</span>
            <Arrow direction="right" />
          </button>
        ))}
      </div>
      <article className="studio-service-detail" id="studio-service-detail"
        aria-live="polite" aria-atomic="true">
        <p className="studio-small-label">BUILT AROUND YOUR GOALS / 0{active + 1}</p>
        <h3>{service.title}</h3>
        <p className="studio-service-copy">{service.copy}</p>
        <div className="studio-capabilities">
          {service.details.map((detail, index) => (
            <div key={detail}>
              <span aria-hidden="true">0{index + 1}</span>
              <p>{detail}</p>
            </div>
          ))}
        </div>
        <div className="studio-service-result">
          <span>WHAT THIS HELPS YOU DO</span>
          <p>{service.outcome}</p>
        </div>
        <a className="button primary" href="#contact">
          Discuss your project <Arrow />
        </a>
      </article>
    </div>
  );
}
