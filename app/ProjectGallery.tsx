"use client";

import { useState } from "react";
import Image from "next/image";
import { Arrow } from "./StudioIcons";
import Link from "next/link";

type Project = {
  projectSlug?: string;
  name: string;
  category: string;
  copy: string;
  image: string;
  url: string;
};

const projectDetails: Record<string, { focus: string; tools: string[] }> = {
  "NOVA Sports Live": {
    focus: "Bring sports information into one place so fans can follow teams and find the numbers they care about.",
    tools: ["Scores & standings", "Team information", "Rankings & coverage"],
  },
  "DMV Attack": {
    focus: "Connect the organization's public website with tools for running tryouts and supporting coaches.",
    tools: ["Tryout registration", "Coach administration", "Organization information"],
  },
  "Coach Tae QB": {
    focus: "Give athletes and parents a clear introduction to quarterback coaching and the next step toward training.",
    tools: ["Training information", "Program presentation", "Parent inquiries"],
  },
  "Maverick Athletics Training": {
    focus: "Introduce the training business through a branded digital home with clear program information.",
    tools: ["Business identity", "Training programs", "Service information"],
  },
  "Merriton Federal": {
    focus: "Present a professional services company with clear information and a credible digital presence.",
    tools: ["Company introduction", "Service presentation", "Professional branding"],
  },
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All projects");
  const filters = ["All projects", "Platforms & tools", "Business websites"];
  const shown = projects.filter((_, index) =>
    filter === "All projects" ||
    (filter === "Platforms & tools" ? index < 2 : index >= 2));

  return (
    <div className="studio-projects">
      <div className="studio-project-filters" aria-label="Filter projects">
        {filters.map((item) => (
          <button key={item} type="button" aria-pressed={filter === item}
            onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <p className="sr-only" role="status">{shown.length} projects shown</p>
      <div className="studio-project-list">
        {shown.map((project) => {
          const details = projectDetails[project.name];
          return (
            <article className="studio-project" key={project.name}>
              <div className="studio-project-visual">
                <span className="studio-small-label">{project.category}</span>
                <Image src={project.image} alt={`${project.name} logo`}
                  width={420} height={260} />
                <span className="studio-project-caption">SELECTED CRESTLANE WORK</span>
              </div>
              <div className="studio-project-copy">
                <h3>{project.name}</h3>
                <p>{project.copy}</p>
                {project.projectSlug && <Link className="studio-project-visit" href={`/work/${project.projectSlug}`}>
                  Read case study <Arrow direction="right" />
                </Link>}
                {details && (
                  <>
                    <div className="studio-project-tags">
                      {details.tools.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                    <details className="studio-project-story">
                      <summary>Explore the project <Arrow direction="down" /></summary>
                      <p>{details.focus}</p>
                    </details>
                  </>
                )}
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  className="studio-project-visit">
                  Visit website <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
