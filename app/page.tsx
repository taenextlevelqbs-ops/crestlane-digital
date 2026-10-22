import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import ServiceExplorer from "./ServiceExplorer";
import ProjectGallery from "./ProjectGallery";
import WorkflowDemo from "./WorkflowDemo";
import InquiryForm from "./InquiryForm";
import CommunicationHub from "./CommunicationHub";
import { Arrow } from "./StudioIcons";
import StudioMotion from "./StudioMotion";
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
        kind: "platform" as const,
    },
    {
        name: "DMV Attack",
        projectSlug: "dmv-attack",
        category: "WEBSITE + ORGANIZATION TOOLS",
        copy: "A football organization's digital home, with tryout registration and coach administration tools.",
        image: "/dmvattack.jpeg",
        url: "https://dmvattack.com",
        kind: "platform" as const,
    },
    {
        name: "Coach Tae QB",
        projectSlug: "coach-tae-qb",
        category: "ATHLETE DEVELOPMENT",
        copy: "A clear home for quarterback training, programs, and parent inquiries.",
        image: "/CoachTaeqb.png",
        url: "https://coachtaeqb.com",
        kind: "website" as const,
    },
    {
        name: "Maverick Athletics Training",
        category: "PERFORMANCE TRAINING",
        copy: "A branded website introducing the business and its training programs.",
        image: "/maverickathleticstraining.PNG",
        url: "https://www.maverickathleticstraining.com/",
        kind: "website" as const,
    },
    {
        name: "Merriton Federal",
        category: "PROFESSIONAL SERVICES",
        copy: "A professional digital presence presenting the company and its services.",
        image: "/Merriton Transparent Logo.png",
        url: "https://www.merritonfederal.com/",
        kind: "website" as const,
    },
];
export default function Home() {
  return <main id="home">
    <StudioMotion />
    <a className="skip-link" href="#work">Skip to selected work</a>
    <div className="masthead">
      <header className="header wrap">
        <a className="brand crestlane-logo-link" href="#home" aria-label="Crestlane Digital home">
          <span className="brand-wordmark"><strong>crestlane<span>.</span></strong><small>DIGITAL STUDIO</small></span>
        </a>
        <Navigation />
      </header>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-topline"><p className="eyebrow">INDEPENDENT THINKING. CONSIDERED EXECUTION.</p><span>NORTHERN VIRGINIA / WORKING EVERYWHERE</span></div>
        <div className="hero-grid">
          <div className="hero-content">
            <h1 id="hero-title">Good design.<br /><em>Better business.</em></h1>
            <p className="hero-description">Websites, software, and connected systems. Thoughtfully designed. Built to move your business forward.</p>
            <div className="buttons"><a className="button primary" href="#contact">Start a conversation <Arrow /></a><a className="button text-link" href="#work">Explore our work <Arrow direction="down" /></a></div>

          </div>
          <Link className="hero-project" href="/work/dmv-attack" aria-label="View the DMV Attack case study">
            <div className="hero-project-top"><span>IN FOCUS / 01</span><Arrow /></div>
            <div className="hero-project-screen"><div className="browser-bar"><i /><i /><i /><span>dmvattack.com</span></div><Image src="/work/dmv-attack.webp" alt="DMV Attack website with its football program and athlete photography" width={1440} height={1000} sizes="(max-width: 800px) 90vw, 45vw" priority /></div>
            <div className="hero-project-caption"><div><strong>DMV Attack</strong><span>Website & organization tools</span></div><span>VIEW PROJECT ↗</span></div>
          </Link>
        </div>
        <div className="hero-bottom"><span>STRATEGY & DESIGN</span><span>WEB & SOFTWARE DEVELOPMENT</span><span>AUTOMATION & ONGOING SUPPORT</span><a href="#work" aria-label="Scroll to selected work"><Arrow direction="down" /></a></div>
      </section>
    </div>

    <section className="section work-section" id="work" tabIndex={-1} aria-labelledby="work-title"><div className="wrap">
      <div className="section-heading"><p className="eyebrow">01 / SELECTED WORK</p><h2 id="work-title">Built for real people.<br /><em>Made to work.</em></h2><p>Digital experiences for ambitious businesses, growing teams, and the communities around them.</p></div>
      <ProjectGallery projects={projects} />
    </div></section>

    <section className="section services-section" id="services" tabIndex={-1} aria-labelledby="services-title"><div className="wrap">
      <div className="section-heading"><p className="eyebrow">02 / OUR CAPABILITIES</p><h2 id="services-title">The right thinking.<br /><em>The right tools.</em></h2><p>From your first impression to the systems behind it, we connect design and development around what your business needs.</p></div>
      <ServiceExplorer services={services} />
    </div></section>

    <WorkflowDemo />

    <section className="section about-section" id="about" tabIndex={-1} aria-labelledby="about-title"><div className="wrap about split">
      <div><p className="eyebrow">04 / THE CRESTLANE APPROACH</p><h2 id="about-title">Good work starts<br />with <em>understanding.</em></h2><p className="about-aside">Practical thinking.<br />Attention to detail.<br />A clear way forward.</p></div>
      <div className="about-copy"><p>Your business deserves more than a template and a handoff.</p><p>We take the time to understand how you work, what your customers need, and where your technology can make a difference. Then we design and build around that.</p>
        <div className="studio-process" aria-label="How a Crestlane project moves forward"><ol>
          <li><span>01</span><div><h3>Understand first.</h3><p>We get clear on your goals, your audience, and what needs to work better.</p></div></li>
          <li><span>02</span><div><h3>Build with purpose.</h3><p>We shape the scope, design the experience, and develop the right solution.</p></div></li>
          <li><span>03</span><div><h3>Make the next step clear.</h3><p>Launch support, a considered handoff, and an agreed plan for what comes next.</p></div></li>
        </ol></div>
      </div>
    </div></section>

    <CommunicationHub />

    <section className="contact-section" id="contact" tabIndex={-1}><div className="wrap split">
      <div><p className="eyebrow">06 / START SOMETHING GOOD</p><h2>A better next<br />chapter <em>starts here.</em></h2><p className="section-copy">A new idea. A website that needs more. A process that could work better. Tell us what you have in mind.</p><div className="direct-contact"><a href="mailto:sales@crestlanedigital.com">sales@crestlanedigital.com <Arrow /></a><a href="tel:+17034314468">(703) 431-4468</a><a href="tel:+17039806483">(703) 980-6483</a></div></div>
      <div className="inquiry-panel"><InquiryForm /></div>
    </div></section>

    <footer className="site-footer"><div className="wrap"><div className="footer-top"><a className="footer-brand" href="#home">crestlane<span>.</span></a><p>Good thinking.<br />Thoughtfully built.</p><nav className="footer-navigation" aria-label="Footer navigation"><a href="#services">Services</a><a href="#work">Selected work</a><a href="#about">About Crestlane</a><a href="#contact">Start a project</a><Link href="/portal">Client portal</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Crestlane Digital</span><span>Northern Virginia & beyond</span><a href="#home">Back to top <Arrow direction="up" /></a></div></div></footer>
  </main>;
}
