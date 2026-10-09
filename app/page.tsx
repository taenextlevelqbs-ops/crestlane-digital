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
          <Image src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" width={160} height={160} priority className="crestlane-header-logo"/>
        </a>
        <Navigation />
      </header>

      <section className="hero">
        <div className="stars" aria-hidden="true"/>
        <InteractiveGlobe />

        <div className="hero-content wrap">
          <p className="eyebrow"><span className="status-dot"/>YOUR NEXT CHAPTER, BUILT.</p>
          <h1>A better website.<br />A smarter business.<br /><span>A new orbit.</span></h1>
          <p className="hero-description">
            Websites, custom software, automation, and website security that help your
            business look exceptional and run more smoothly.
          </p>
          <div className="buttons">
            <a className="button primary" href="#contact">{iconText("Let\u2019s build something \u2197")}</a>
            <a className="button secondary" href="#work">{iconText("Explore our work \u2193")}</a>
          </div>
          <p className="hero-note">For businesses, sports organizations, and ambitious ideas.</p>
        </div>

        <div className="hero-bottom wrap">
          <span>DESIGN WITH IMPACT. TECHNOLOGY WITH PURPOSE.</span>
          <a href="#services">{iconText("Discover what\u2019s possible \u2193")}</a>
        </div>
      </section>

      <section className="section wrap" id="services" tabIndex={-1}>
        <div className="section-heading">
          <p className="eyebrow">01 / WHAT WE BUILD</p>
          <h2>Big possibilities.<br /><span>Simple experiences.</span></h2>
          <p>You bring the idea—or the problem. We turn it into technology people can actually use.</p>
        </div>
        <ServiceExplorer services={services}/>
      </section>

      <WorkflowDemo />

      <section className="section wrap" id="work" tabIndex={-1}>
        <div className="section-heading">
          <p className="eyebrow">03 / SELECTED WORK</p>
          <h2>Ideas, brought<br /><span>into the real world.</span></h2>
          <p>Websites and platforms built around the people who use them.</p>
        </div>
        <ProjectGallery projects={projects}/>
      </section>

      <section className="section wrap about split" id="about" tabIndex={-1}>
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
            
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" tabIndex={-1}>
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
          <Image src="/CrestLaneDigitalLogo2.jpeg" alt="Crestlane Digital" width={190} height={190} className="crestlane-footer-logo"/>
        </a>
        <p>Websites. Software. Smarter operations.</p>
        <a href="#home">{iconText("Back to top \u2191")}</a>
        <span>©  Crestlane Digital</span>
      </footer>
    </main>);
}
