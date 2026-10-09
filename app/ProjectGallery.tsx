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

const projectDetails: Record<string, string[]> = {
  "NOVA Sports Live": ["Scores & schedules", "Team information", "Regional coverage"],
  "DMV Attack": ["Tryout registration", "Coach tools", "Program information"],
  "Coach Tae QB": ["Training programs", "Athlete development", "Parent inquiries"],
  "Maverick Athletics Training": ["Training programs", "Business identity", "Service information"],
  "Merriton Federal": ["Company introduction", "Service information", "Professional branding"],
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All projects");
  const filters = ["All projects", "Platforms & tools", "Business websites"];
  const shown = projects.filter((_, index) =>
    filter === "All projects" ||
    (filter === "Platforms & tools" ? index < 2 : index >= 2));

  return (
    <div className="studio-projects">
      <div className="studio-project-filters" role="group" aria-label="Filter projects">
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
                <Image src={project.image} alt={`${project.name} project identity`}
                  width={420} height={260} />
                <span className="studio-project-caption">PROJECT IDENTITY · LIVE SITE LINK BELOW</span>
              </div>
              <div className="studio-project-copy">
                <h3>{project.name}</h3>
                <p>{project.copy}</p>
                {project.projectSlug && <Link className="studio-project-visit" href={`/work/${project.projectSlug}`}>
                  Read case study <Arrow direction="right" />
                </Link>}
                {details && <ul className="studio-project-tags" aria-label={`${project.name} features`}>
                  {details.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>}
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
