const capabilities = [
  "Website Design",
  "Web Development",
  "Digital Systems",
  "Security & Monitoring",
  "Support & Maintenance",
];

const services = [
  {
    number: "01",
    title: "Design & Development",
    text: "Modern websites designed around your brand, customers and business goals.",
  },
  {
    number: "02",
    title: "Digital Solutions",
    text: "Practical technology that helps businesses improve how they operate online.",
  },
  {
    number: "03",
    title: "Security & Monitoring",
    text: "Website hardening, uptime monitoring and preventative security measures.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    text: "Maintenance, updates, troubleshooting and continued technical support.",
  },
];

const projects = [
  {
    tag: "SPORTS MEDIA",
    name: "NOVA Sports Live",
    code: "NSL",
    className: "projectLarge",
  },
  {
    tag: "SPORTS ORGANIZATION",
    name: "DMV Attack",
    code: "DMA",
    className: "",
  },
  {
    tag: "ATHLETE DEVELOPMENT",
    name: "Coach Tae QB",
    code: "CTQ",
    className: "",
  },
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <a className="brand" href="#">
          <img src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" />
        </a>

        <nav>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#support">Support</a>
          <a href="#about">About</a>
        </nav>

        <a className="navButton" href="mailto:sales@crstlanedigital.com">
          Let&apos;s Talk
          <span>↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow">
            <i />
            DIGITAL SOLUTIONS FOR MODERN BUSINESS
          </div>

          <h1>
            Technology should
            <br />
            move your business
            <br />
            <span>forward.</span>
          </h1>

          <p>
            Crestlane Digital designs, builds and supports modern digital
            experiences for businesses that want technology to work better.
          </p>

          <div className="heroButtons">
            <a className="primaryButton" href="mailto:sales@crstlanedigital.com">
              Start a Project
              <span>↗</span>
            </a>

            <a className="secondaryButton" href="#work">
              View Our Work
            </a>
          </div>

          <div className="capabilities">
            {capabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </div>

        <div className="heroVisual">
          <div className="visualHeader">
            <div className="windowDots">
              <i />
              <i />
              <i />
            </div>

            <span>CRESTLANE / DIGITAL OPERATIONS</span>

            <strong>LIVE</strong>
          </div>

          <div className="visualMain">
            <div className="visualLabel">
              <span>PROJECT ENVIRONMENT</span>
              <strong>ONLINE</strong>
            </div>

            <div className="metric">
              <span>DIGITAL</span>
              <strong>READY</strong>
              <p>Design · Development · Support</p>
            </div>

            <div className="graph">
              <span className="graphLine" />
              <i className="g1" />
              <i className="g2" />
              <i className="g3" />
              <i className="g4" />
              <i className="g5" />
              <i className="g6" />
              <i className="g7" />
              <i className="g8" />
            </div>

            <div className="systemMetrics">
              <div>
                <span>WEB</span>
                <strong>ACTIVE</strong>
              </div>

              <div>
                <span>SECURITY</span>
                <strong>MONITORED</strong>
              </div>

              <div>
                <span>SUPPORT</span>
                <strong>READY</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="intro" id="about">
        <div className="introLabel">
          <span>01</span>
          <p>THE COMPANY</p>
        </div>

        <div className="introMain">
          <h2>
            More than a website.
            <br />
            <span>A digital partner.</span>
          </h2>

          <div className="introText">
            <p>
              We combine design, development and practical technology to help
              businesses create a stronger digital presence.
            </p>

            <p>
              From the first build to ongoing monitoring and support, Crestlane
              focuses on solutions that look sharp, perform well and make sense
              for the business behind them.
            </p>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="sectionTitle">
          <span>02 / SERVICES</span>
          <h2>How we can help.</h2>
        </div>

        <div className="serviceList">
          {services.map((service) => (
            <article key={service.number}>
              <span className="serviceNumber">{service.number}</span>

              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>

              <span className="serviceArrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="work" id="work">
        <div className="sectionTitle workTitle">
          <span>03 / SELECTED WORK</span>
          <h2>Built by Crestlane.</h2>
        </div>

        <div className="bento">
          {projects.map((project, index) => (
            <article
              className={`projectCard ${project.className}`}
              key={project.name}
            >
              <div className="projectTop">
                <span>{project.tag}</span>
                <span>0{index + 1}</span>
              </div>

              <div className="projectCode">{project.code}</div>

              <div className="projectBottom">
                <div>
                  <span>PROJECT</span>
                  <h3>{project.name}</h3>
                </div>

                <span className="projectArrow">↗</span>
              </div>
            </article>
          ))}

          <article className="projectStatement">
            <span>CRESTLANE DIGITAL</span>

            <h3>
              Built clean.
              <br />
              Built modern.
              <br />
              <strong>Built right.</strong>
            </h3>

            <p>
              Every project starts with the problem, not a template.
            </p>
          </article>
        </div>
      </section>

      <section className="support" id="support">
        <div className="supportIntro">
          <span>04 / AFTER LAUNCH</span>

          <h2>
            Going live is
            <br />
            just the beginning.
          </h2>

          <p>
            Crestlane can stay involved after launch to help keep your website
            available, maintained and protected.
          </p>

          <a href="mailto:sales@crstlanedigital.com">
            Ask about ongoing support <span>↗</span>
          </a>
        </div>

        <div className="monitor">
          <div className="monitorHeader">
            <span>MONITOR / 01</span>

            <div>
              <i />
              SYSTEM ONLINE
            </div>
          </div>

          <div className="monitorRows">
            <div>
              <span className="monitorIcon">●</span>
              <p>Uptime Monitoring</p>
              <strong>ACTIVE</strong>
            </div>

            <div>
              <span className="monitorIcon">◇</span>
              <p>Security Review</p>
              <strong>READY</strong>
            </div>

            <div>
              <span className="monitorIcon">↗</span>
              <p>Performance Checks</p>
              <strong>READY</strong>
            </div>

            <div>
              <span className="monitorIcon">↻</span>
              <p>Maintenance</p>
              <strong>AVAILABLE</strong>
            </div>
          </div>

          <div className="monitorFooter">
            <span>CRESTLANE DIGITAL</span>
            <span>OPERATIONS</span>
          </div>
        </div>
      </section>

      <section className="cta">
        <div>
          <span>05 / LET&apos;S WORK</span>

          <h2>
            Have something
            <br />
            in mind?
          </h2>
        </div>

        <div className="ctaRight">
          <p>
            Tell us about your business, what you&apos;re trying to build and
            where you need help.
          </p>

          <a href="mailto:sales@crstlanedigital.com">
            <span>sales@crstlanedigital.com</span>
            <strong>↗</strong>
          </a>
        </div>
      </section>

      <footer>
        <img src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" />

        <div className="footerLinks">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#support">Support</a>
        </div>

        <span>© 2026 CRESTLANE DIGITAL</span>
      </footer>
    </main>
  );
}
