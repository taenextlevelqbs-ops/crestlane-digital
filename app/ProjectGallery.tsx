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
  kind: "platform" | "website";
};

const featureCopy: Record<string, { framing: string; capabilities: string[] }> = {
  "NOVA Sports Live": {
    framing: "A regional sports destination organized around the season.",
    capabilities: ["Scores and schedules", "Team and season information", "Regional rankings and coverage"],
  },
  "DMV Attack": {
    framing: "A public program website connected to the work behind the scenes.",
    capabilities: ["Program and team information", "Tryout registration", "Coach administration tools"],
  },
};

const filters = ["All projects", "Platforms & tools", "Business websites"] as const;
type ProjectFilter = (typeof filters)[number];

function projectKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ProjectMark({ project, number }: { project: Project; number: string }) {
  return (
    <div className="project-mark-stage" data-project={projectKey(project.name)}>
      <div className="project-mark-meta">
        <span>PROJECT / {number}</span>
        <span>{project.category}</span>
      </div>
      <span className="project-mark-coordinate" aria-hidden="true">{number}<i>—</i>05</span>
      <Image src={project.image} alt={`${project.name} brand mark`} width={640} height={400} />
      <span className="project-mark-caption">CLIENT BRAND ASSET</span>
      <span className="project-mark-orbit" aria-hidden="true" />
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-actions">
      {project.projectSlug && <Link className="project-action project-action--case" href={`/work/${project.projectSlug}`}>
        Explore the case study <Arrow direction="right" />
      </Link>}
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-action">
        Visit live website <Arrow />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

function FeaturedProject({ project, number, reversed }: { project: Project; number: string; reversed?: boolean }) {
  const story = featureCopy[project.name];

  return (
    <article className={`featured-project${reversed ? " featured-project--reversed" : ""}`}>
      <ProjectMark project={project} number={number} />
      <div className="featured-project-copy">
        <p className="featured-project-label"><span>{number}</span> {project.category}</p>
        <h3>{project.name}</h3>
        <p className="featured-project-framing">{story.framing}</p>
        <p className="featured-project-summary">{project.copy}</p>
        <div className="featured-project-capabilities">
          <span>BUILT INTO THE EXPERIENCE</span>
          <ul aria-label={`${project.name} capabilities`}>
            {story.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectFilter>("All projects");
  const shown = projects.filter((project) => filter === "All projects" ||
    (filter === "Platforms & tools" ? project.kind === "platform" : project.kind === "website"));
  const featured = shown.filter((project) => project.kind === "platform");
  const supporting = shown.filter((project) => project.kind === "website");

  return (
    <div className="portfolio-editorial">
      <div className="portfolio-toolbar">
        <div>
          <p className="portfolio-kicker">PROJECT INDEX <span>·</span> NORTHERN VIRGINIA & BEYOND</p>
          <p className="portfolio-count"><strong>{String(shown.length).padStart(2, "0")}</strong> selected projects</p>
        </div>
        <div className="portfolio-filters" role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button key={item} type="button" aria-pressed={filter === item}
              onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">{shown.length} projects shown</p>

      {featured.length > 0 && (
        <div className="featured-project-list" aria-label="Featured platforms and tools">
          {featured.map((project, index) => (
            <FeaturedProject key={project.name} project={project} number={String(index + 1).padStart(2, "0")} reversed={index % 2 === 1} />
          ))}
        </div>
      )}

      {supporting.length > 0 && (
        <section className="project-register" aria-labelledby="project-register-title">
          <div className="project-register-heading">
            <div>
              <p className="portfolio-kicker">MORE FROM THE STUDIO</p>
              <h3 id="project-register-title">Digital homes for growing teams.</h3>
            </div>
            <span>{String(supporting.length).padStart(2, "0")} / BUSINESS WEBSITES</span>
          </div>
          <div className="project-register-list">
            {supporting.map((project, index) => (
              <article className="project-register-row" key={project.name}>
                <span className="project-register-number">{String(index + 3).padStart(2, "0")}</span>
                <div className="project-register-mark" data-project={projectKey(project.name)}>
                  <Image src={project.image} alt={`${project.name} brand mark`} width={160} height={120} />
                </div>
                <div className="project-register-description">
                  <p>{project.category}</p>
                  <h4>{project.name}</h4>
                  <span>{project.copy}</span>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-register-link" aria-label={`Visit ${project.name} website`}>
                  Visit <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
