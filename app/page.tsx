"use client";
import { iconText } from "./StudioIcons";
import Navigation from "./Navigation";
import Image from "next/image";
import InteractiveGlobe from "./InteractiveGlobe";
import ServiceExplorer from "./ServiceExplorer";
import ProjectGallery from "./ProjectGallery";
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
        projectSlug: "nova-sports-live",
        category: "SPORTS INFORMATION PLATFORM",
        copy: "Scores, teams, rankings, and coverage brought together for Northern Virginia sports.",
        image: "/novasportslive.png",
        url: "https://novasportslive.com",
    },
    {
        name: "DMV Attack",
        projectSlug: "dmv-attack",
        category: "WEBSITE + ORGANIZATION TOOLS",
        copy: "A football organization's digital home, with tryout registration and coach administration tools.",
        image: "/dmvattack.jpeg",
        url: "https://dmvattack.com",
    },
    {
        name: "Coach Tae QB",
        projectSlug: "coach-tae-qb",
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
    return (<main id="home">
      <a className="skip-link" href="#services">Skip to services</a>

      <header className="header wrap">
        <a className="brand crestlane-logo-link" href="#home" aria-label="Crestlane Digital home">
          <Image src="/CrestLaneDigitalLogo.jpeg" alt="" width={160} height={160} priority className="crestlane-header-logo"/>
          <span className="brand-wordmark"><strong>Crestlane</strong><small>Digital studio</small></span>
        </a>
        <Navigation />
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid wrap">
          <div className="hero-content">
            <p className="eyebrow"><span className="status-dot"/>WEB DESIGN · SOFTWARE · SMARTER OPERATIONS</p>
            <h1 id="hero-title">Make room for<br /><em>what’s next.</em></h1>
            <p className="hero-description">
              We build the websites, custom software, and connected workflows that help your business move forward.
            </p>
            <div className="buttons">
              <a className="button primary" href="#contact">{iconText("Start a project \u2197")}</a>
              <a className="button text-link" href="#work">{iconText("See selected work \u2193")}</a>
            </div>
            <div className="hero-note">
              <span className="hero-note-index">01—03</span>
              <span>Strategy, design, and engineering.<br />One clear path from idea to launch.</span>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-visual-label">A BETTER WAY TO WORK, IN EVERY DIRECTION</span>
            <InteractiveGlobe />
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>DESIGNED AROUND PEOPLE. BUILT FOR THE WORK AHEAD.</span>
          <a href="#services">{iconText("Explore our capabilities \u2193")}</a>
        </div>
      </section>

      <section className="section services-section wrap" id="services" tabIndex={-1} aria-labelledby="services-title">
        <div className="section-heading">
          <p className="eyebrow">01 / WHAT WE BUILD</p>
          <h2 id="services-title">Technology should make the work <em>easier.</em></h2>
          <p>Start with the problem. We’ll shape the right digital experience around the way your people already work.</p>
        </div>
        <ServiceExplorer services={services}/>
      </section>

      <WorkflowDemo />

      <section className="section work-section wrap" id="work" tabIndex={-1} aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">03 / SELECTED WORK</p>
          <h2 id="work-title">Real work.<br /><em>Thoughtful technology.</em></h2>
          <p>A closer look at digital homes and tools built for real teams, athletes, families, and customers.</p>
        </div>
        <ProjectGallery projects={projects}/>
      </section>

      <section className="section wrap about split" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div>
          <p className="eyebrow">04 / HOW WE WORK</p>
          <h2 id="about-title">Good technology should feel like <em>momentum.</em></h2>
        </div>
        <div className="about-copy">
          <p>
            Crestlane brings product thinking, thoughtful design, and practical engineering to the everyday challenges businesses face.
          </p>
          <p>
            You get a small, senior team that takes the time to understand your operation, explains the trade-offs, and builds only what helps.
          </p>
          <div className="studio-process" aria-label="How a Crestlane project moves forward">
            <p className="studio-small-label">A CLEAR PATH FROM IDEA TO LAUNCH</p>
            <ol>
              <li><span>01</span><div><h3>Understand the work</h3><p>We learn how your business runs, where people get stuck, and what a useful result looks like.</p></div></li>
              <li><span>02</span><div><h3>Design the right system</h3><p>We agree on a practical scope, then shape the experience and technology around it.</p></div></li>
              <li><span>03</span><div><h3>Build, launch, improve</h3><p>You stay part of the decisions, receive a clear handoff, and know what support comes next.</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" tabIndex={-1}>
        <div className="wrap split">
          <div>
            <p className="eyebrow">05 / START A CONVERSATION</p>
            <h2>What needs to work <em>better?</em></h2>
            <p className="section-copy">
              Tell us what you’re trying to change. We’ll help turn the first conversation into a practical next step.
            </p>
          </div>
          <div className="inquiry-panel">
            <div className="direct-contact">
              <a href="tel:+17034314468">{iconText("Call (703) 431-4468 \u2197")}</a>
<a href="tel:+17039806483">(703) 980-6483</a>
              <a href="mailto:sales@crestlanedigital.com">{iconText("sales@crestlanedigital.com \u2197")}</a>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>

      <footer className="wrap">
        <a className="footer-brand crestlane-footer-link" href="#home" aria-label="Crestlane Digital home">
          <Image src="/CrestLaneDigitalLogo2.jpeg" alt="" width={190} height={190} className="crestlane-footer-logo"/>
          <span className="brand-wordmark"><strong>Crestlane</strong><small>Digital studio</small></span>
        </a>
        <p>Websites · Software · Smarter operations</p>
        <nav className="footer-navigation" aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#work">Selected work</a>
          <a href="#about">About Crestlane</a>
          <a href="#contact">Start a project</a>
        </nav>
        <a href="#home">{iconText("Back to top \u2191")}</a>
        <span>© {new Date().getFullYear()} Crestlane Digital</span>
      </footer>
    </main>);
}
