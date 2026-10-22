"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./StudioIcons";
type Project = { projectSlug?: string; name: string; category: string; copy: string; image: string; url: string; kind: "platform" | "website" };
const filters = ["All projects", "Platforms & tools", "Business websites"] as const;
export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All projects");
  const shown = projects.filter(p => filter === "All projects" || (filter === "Platforms & tools" ? p.kind === "platform" : p.kind === "website"));
  return <div className="portfolio-editorial">
    <div className="portfolio-toolbar"><span className="portfolio-count">{String(shown.length).padStart(2, "0")} SELECTED PROJECTS</span><div className="portfolio-filters" role="group" aria-label="Filter projects">{filters.map(f => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
    <p className="sr-only" role="status">{shown.length} projects shown</p>
    <div className="project-grid">{shown.map((p) => <article className={`project-card ${p.kind === "platform" ? "featured-project" : "project-register-row"}`} key={p.name}>
      {p.projectSlug ? <Link href={`/work/${p.projectSlug}`} className={`project-preview ${p.projectSlug === "coach-tae-qb" ? "project-identity" : ""}`} aria-label={`View ${p.name} case study`}><div className="browser-bar"><i /><i /><i /><span>{new URL(p.url).hostname}</span><Arrow /></div><Image src={p.projectSlug === "coach-tae-qb" ? p.image : `/work/${p.projectSlug}.webp`} alt={p.projectSlug === "coach-tae-qb" ? `${p.name} brand mark` : `${p.name} website preview`} width={1440} height={1000} sizes="(max-width: 700px) 90vw, 45vw" /></Link> : <a href={p.url} className="project-preview project-identity" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.name} website`}><Image src={p.image} alt={`${p.name} brand mark`} width={600} height={400} sizes="(max-width: 700px) 90vw, 45vw" /><Arrow /></a>}
      <div className="project-card-heading"><div><p className="project-category">{p.category}</p><h3>{p.name}</h3></div>{p.projectSlug ? <Link className="project-action" href={`/work/${p.projectSlug}`} aria-label={`${p.name} case study`}><Arrow /></Link> : <a className="project-register-link" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${p.name} website`}><Arrow /></a>}</div>
      <p className="project-summary">{p.copy}</p>
      {p.projectSlug && <div className="project-actions"><Link className="project-action" href={`/work/${p.projectSlug}`}>View case study <Arrow /></Link><a className="project-action" href={p.url} target="_blank" rel="noopener noreferrer">Visit website <Arrow /><span className="sr-only"> (opens in a new tab)</span></a></div>}
    </article>)}</div>
  </div>;
}
