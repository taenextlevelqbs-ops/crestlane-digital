import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "../../StudioIcons";
import { caseStudies } from "../case-studies";
import "./case-study.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return caseStudies.map(({ slug }) => ({ slug })); }
async function getStudy(props: Props) {
  const { slug } = await props.params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  return study;
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  const study = await getStudy(props);
  return {
    title: `${study.name} | Crestlane Digital Case Study`,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title: `${study.name} — Selected Work`, description: study.summary, images: [study.image], type: "article" },
  };
}
export default async function CaseStudyPage(props: Props) {
  const study = await getStudy(props);
  return <main className="case-study wrap">
    <header className="case-site-header">
      <Link href="/#home" aria-label="Crestlane Digital home"><Image src="/CrestLaneDigitalLogo.jpeg" alt="" width={130} height={110} priority /></Link>
      <nav aria-label="Case study navigation">
        <Link href="/#work">Selected work</Link>
        <Link href="/#services">Services</Link>
        <Link className="button secondary" href="/#contact">Start a project <Arrow /></Link>
      </nav>
    </header>
    <nav className="case-breadcrumb" aria-label="Breadcrumb"><Link href="/#work">Selected work</Link><span aria-hidden="true">/</span><span>{study.name}</span></nav>
    <header className="case-hero">
      <div><p className="eyebrow">{study.category}</p><h1>{study.name}</h1><p className="case-summary">{study.summary}</p><a className="button secondary" href={study.url} target="_blank" rel="noopener noreferrer">Visit the live project <Arrow /><span className="sr-only"> (opens in a new tab)</span></a></div>
      <div className="case-brand-visual"><Image src={study.image} alt={`${study.name} project identity`} width={520} height={340} priority /><span>PROJECT IDENTITY</span></div>
    </header>
    <section className="case-facts" aria-label="Project overview">
      <article><span>THE CHALLENGE</span><p>{study.challenge}</p></article>
      <article><span>THE APPROACH</span><p>{study.approach}</p></article>
      <article><span>THE DELIVERED EXPERIENCE</span><p>{study.outcome}</p></article>
    </section>
    <section className="case-capabilities"><div><p className="eyebrow">WHAT IT DOES</p><h2>Built around the people who use it.</h2></div><ul>{study.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
    <section className="case-technology"><p className="eyebrow">TECHNICAL APPROACH</p><h2>Technology should serve the experience.</h2><p>{study.technology}</p><p>Framework, hosting, and integration details are listed only when confirmed against the project implementation.</p></section>
    <section className="case-cta"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s build something useful.</h2><Link className="button primary" href="/#contact">Talk with Crestlane <Arrow /></Link></section>
    <footer className="case-site-footer">
      <Link href="/#home">Crestlane Digital</Link>
      <span>Websites · Software · Smarter operations</span>
      <Link href="/#work">More selected work <Arrow direction="right" /></Link>
    </footer>
  </main>;
}
