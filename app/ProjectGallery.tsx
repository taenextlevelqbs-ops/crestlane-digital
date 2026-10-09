"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./StudioIcons";

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

const filters = ["All projects", "Platforms & tools", "Business websites"];

function projectKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ProjectIdentity({ project, number }: { project: Project; number: string }) {
  return (
    <div className="studio-project-visual" data-project={projectKey(project.name)}>
      <div className="project-visual-meta">
        <span>{number} / SELECTED WORK</span>
        <span>{project.category}</span>
      </div>
      <Image src={project.image} alt={`${project.name} project identity`}
        width={640} height={400} />
      <span className="studio-project-caption">PROJECT IDENTITY · VISIT THE LIVE SITE</span>
      <span className="project-visual-orbit" aria-hidden="true" />
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-actions">
      {project.projectSlug && <Link className="studio-project-visit" href={`/work/${project.projectSlug}`}>
        Read the case study <Arrow direction="right" />
      </Link>}
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="studio-project-visit">
        Visit website <Arrow />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All projects");
  const shown = projects.filter((_, index) =>
    filter === "All projects" ||
    (filter === "Platforms & tools" ? index < 2 : index >= 2));
  const featured = shown.filter((project) => project.name === "NOVA Sports Live" || project.name === "DMV Attack");
  const otherProjects = shown.filter((project) => !featured.includes(project));

  return (
    <div className="studio-projects">
      <div className="studio-project-toolbar">
        <p>WORK THAT MEETS PEOPLE WHERE THEY ARE.</p>
        <div className="studio-project-filters" role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button key={item} type="button" aria-pressed={filter === item}
              onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">{shown.length} projects shown</p>

      <div className="studio-project-list">
        {featured.map((project) => {
          const details = projectDetails[project.name] || [];
          const isAttack = project.name === "DMV Attack";
          return (
            <article className={`studio-project studio-project--featured${isAttack ? " is-reversed" : ""}`}
              key={project.name}>
              <ProjectIdentity project={project} number={isAttack ? "02" : "01"} />
              <div className="studio-project-copy">
                <p className="studio-small-label">{project.category}</p>
                <h3>{project.name}</h3>
                <p className="project-summary">{project.copy}</p>
                <ul className="studio-project-tags" aria-label={`${project.name} features`}>
                  {details.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <ProjectLinks project={project} />
              </div>
            </article>
          );
        })}
      </div>

      {otherProjects.length > 0 && (
        <div className="studio-project-supporting" aria-label="More selected projects">
          {otherProjects.map((project, index) => {
            const details = projectDetails[project.name] || [];
            return (
              <article className="studio-project studio-project--supporting" key={project.name}>
                <ProjectIdentity project={project} number={`0${index + 3}`} />
                <div className="studio-project-copy">
                  <p className="studio-small-label">{project.category}</p>
                  <h3>{project.name}</h3>
                  <p className="project-summary">{project.copy}</p>
                  <ul className="studio-project-tags" aria-label={`${project.name} features`}>
                    {details.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <ProjectLinks project={project} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
