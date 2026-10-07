"use client";

import { useState } from "react";
import Image from "next/image";
import WorkflowDemo from "./WorkflowDemo";
import InquiryForm from "./InquiryForm";


const services = [
  {
    "title": "Websites that stand out.",
    "copy": "Turn visitors into inquiries with a fast, polished website that explains what you offer and makes taking action easy.",
    "examples": "Business websites · Online stores · Booking · Redesigns",
    "details": [
      "Business websites and landing pages with clear service information and calls to action.",
      "Mobile-friendly layouts, accessible navigation, and search engine fundamentals.",
      "Online stores, appointment booking, inquiry forms, and payment integrations.",
      "Website redesigns, content migration, analytics, and launch support."
    ],
    "outcome": "A clear digital home that helps people find you, trust you, and take the next step."
  },
  {
    "title": "Software built around you.",
    "copy": "Bring the work you manage across spreadsheets, messages, and separate tools into one practical system.",
    "examples": "Dashboards · Portals · Registration · Reporting",
    "details": [
      "Customer and parent portals for accessing information and managing requests.",
      "Staff dashboards with access based on each person's responsibilities.",
      "Registration, check-in, team rosters, evaluations, and organization tools.",
      "Payment tracking, reporting, and integrations with the platforms you already use."
    ],
    "outcome": "Less information scattered across different places. More visibility into what needs attention."
  },
  {
    "title": "Less busywork. More business.",
    "copy": "Connect your tools and automate repeatable tasks, with AI added where it can provide a useful, reliable shortcut.",
    "examples": "Lead follow-up · Reminders · Connected tools · AI",
    "details": [
      "Inquiry routing, lead tracking, and follow-up workflows.",
      "Appointment reminders, registration confirmations, and status notifications.",
      "Connections between forms, email, calendars, databases, and business software.",
      "AI-assisted answers, document summaries, and draft content with human review where needed."
    ],
    "outcome": "Fewer repetitive steps and a more consistent experience for your customers and team."
  },
  {
    "title": "Security built into your website.",
    "copy": "Protect the information people share with you through practical safeguards designed around your website and its users.",
    "examples": "Secure access · Form protection · Updates · Backups",
    "details": [
      "HTTPS setup, secure configuration, and careful handling of API keys and credentials.",
      "Account access controls and multifactor authentication setup where supported.",
      "Form validation, spam controls, and request limits tailored to the application.",
      "Dependency reviews, security updates, monitoring, and backup planning within an agreed scope."
    ],
    "outcome": "A stronger foundation for protecting your website, accounts, and customer information."
  },
  {
    "title": "Support beyond launch.",
    "copy": "Keep your website and systems useful as your business grows, with a clear plan for maintenance and improvements.",
    "examples": "Maintenance · Monitoring · Troubleshooting · Improvements",
    "details": [
      "Agreed maintenance plans for software updates and routine checks.",
      "Website availability monitoring and troubleshooting.",
      "Content changes, new features, and integration support.",
      "Documentation, handover, and guidance for the people managing your tools."
    ],
    "outcome": "A dependable point of contact and a clear path for keeping your technology moving forward."
  }
];

const projects = [
  {
    name: "NOVA Sports Live",
    category: "SPORTS INFORMATION PLATFORM",
    copy: "Scores, teams, rankings, and coverage brought together for Northern Virginia sports.",
    image: "/novasportslive.png",
    url: "https://novasportslive.com",
  },
  {
    name: "DMV Attack",
    category: "WEBSITE + ORGANIZATION TOOLS",
    copy: "A football organization's digital home, with tryout registration and coach administration tools.",
    image: "/dmvattack.jpeg",
    url: "https://dmvattack.com",
  },
  {
    name: "Coach Tae QB",
    category: "ATHLETE DEVELOPMENT",
    copy: "A clear home for quarterback training, programs, and parent inquiries.",
    image: "/CoachTaeqb.png",
    url: "https://coachtaeqb.com",
  },
  {
    name: "Maverick Athletics Training",
    category: "PERFORMANCE TRAINING",
    copy: "A branded website introducing the business and its training programs.",
    image: "/maverickathleticstraining.PNG",
    url: "https://www.maverickathleticstraining.com/",
  },
  {
    name: "Merriton Federal",
    category: "PROFESSIONAL SERVICES",
    copy: "A professional digital presence presenting the company and its services.",
    image: "/Merriton Transparent Logo.png",
    url: "https://www.merritonfederal.com/",
  },
];


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="home">
      <a className="skip-link" href="#services">Skip to services</a>

      <header className="header wrap">
        
        <a className="brand crestlane-logo-link" href="#home" aria-label="Crestlane Digital home">
          <Image
            src="/CrestLaneDigitalLogo.jpeg"
            alt="Crestlane Digital"
            width={160}
            height={160}
            priority
            className="crestlane-header-logo"
          />
        </a>
        <button
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={menuOpen ? "navigation open" : "navigation"}
          onClick={() => setMenuOpen(false)}
        >
          <a href="#services">Services</a>
          <a href="#work">Our work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="#contact">Start a project ↗</a>
        </nav>
      </header>

      <section className="hero">
        <div className="stars" aria-hidden="true" />
        <div className="space-scene" aria-hidden="true">
          <div className="planet" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="satellite" />
        </div>

        <div className="hero-content wrap">
          <p className="eyebrow"><span className="status-dot" />YOUR NEXT CHAPTER, BUILT.</p>
          <h1>A better website.<br />A smarter business.<br /><span>A new orbit.</span></h1>
          <p className="hero-description">
            Websites, custom software, automation, and website security that help your
            business look exceptional and run more smoothly.
          </p>
          <div className="buttons">
            <a className="button primary" href="#contact">Let’s build something ↗</a>
            <a className="button secondary" href="#work">Explore our work ↓</a>
          </div>
          <p className="hero-note">For businesses, sports organizations, and ambitious ideas.</p>
        </div>

        <div className="hero-bottom wrap">
          <span>DESIGN WITH IMPACT. TECHNOLOGY WITH PURPOSE.</span>
          <a href="#services">Discover what’s possible ↓</a>
        </div>
      </section>

      <section className="section wrap" id="services">
        <div className="section-heading">
          <p className="eyebrow">01 / WHAT WE BUILD</p>
          <h2>Big possibilities.<br /><span>Simple experiences.</span></h2>
          <p>You bring the idea—or the problem. We turn it into technology people can actually use.</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <span className="number">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <div className="service-examples">{service.examples}</div>
              <details className="service-details">
                <summary>Explore this service <span aria-hidden="true">＋</span></summary>
                <ul>
                  {service.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                <p className="service-outcome">{service.outcome}</p>
                <a className="service-inquiry" href="#contact">Discuss your project ↗</a>
              </details>
            </article>
          ))}
        </div>
      </section>

      <WorkflowDemo />

      <section className="section wrap" id="work">
        <div className="section-heading">
          <p className="eyebrow">03 / SELECTED WORK</p>
          <h2>Ideas, brought<br /><span>into the real world.</span></h2>
          <p>Websites and platforms built around the people who use them.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a
              className="project"
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="project-top">
                <span>{project.category}</span><span aria-hidden="true">↗</span>
              </div>
              <div className="project-image">
                <Image src={project.image} alt={`${project.name} logo`} width={300} height={180} />
              </div>
              <h3>{project.name}</h3>
              <p>{project.copy}</p>
              <span className="project-link">
                Visit website ↗<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section wrap about split" id="about">
        <div>
          <p className="eyebrow">04 / THE PEOPLE BEHIND THE TECHNOLOGY</p>
          <h2>Built with care.<br /><span>Made to make sense.</span></h2>
        </div>
        <div className="about-copy">
          <p>
            Crestlane Digital brings design, development, and practical IT
            experience together to help businesses and organizations move forward.
          </p>
          <p>
            We start by understanding how you work. Then we build the right
            website, software, or workflow—with clear communication from the
            first conversation through launch.
          </p>
          <div className="process">
            {["Understand your goals", "Build and refine", "Launch and support"].map((item, index) => (
              <div key={item}><span>0{index + 1}</span>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="wrap split">
          <div>
            <p className="eyebrow">05 / LET’S MAKE IT HAPPEN</p>
            <h2>What’s your<br /><span>next big thing?</span></h2>
            <p className="section-copy">
              Tell us what you want to build, improve, or protect.
              Share what you know—we’ll help you figure out the next steps.
            </p>
          </div>
          <div className="inquiry-panel">
            <div className="direct-contact">
              <a href="tel:+17034314468">Call (703) 431-4468 ↗</a>
              <a href="mailto:sales@crestlanedigital.com">sales@crestlanedigital.com ↗</a>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>

      <footer className="wrap">
        
        <a className="footer-brand crestlane-footer-link" href="#home" aria-label="Crestlane Digital home">
          <Image
            src="/CrestLaneDigitalLogo2.jpeg"
            alt="Crestlane Digital"
            width={190}
            height={190}
            className="crestlane-footer-logo"
          />
        </a>
        <p>Websites. Software. Smarter operations.</p>
        <a href="#home">Back to top ↑</a>
        <span>© {new Date().getFullYear()} Crestlane Digital</span>
      </footer>
    </main>
  );
}
