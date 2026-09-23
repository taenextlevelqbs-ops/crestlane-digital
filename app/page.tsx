const services = [
  {
    number: "01",
    title: "Web Design",
    text: "Distinct, modern interfaces built around your brand and your customers.",
  },
  {
    number: "02",
    title: "Development",
    text: "Fast, responsive websites built with modern technology and clean code.",
  },
  {
    number: "03",
    title: "Digital Systems",
    text: "Practical digital solutions that make your business easier to operate.",
  },
  {
    number: "04",
    title: "Security & Monitoring",
    text: "Website monitoring, security hardening, uptime checks and ongoing protection.",
  },
  {
    number: "05",
    title: "Support & Maintenance",
    text: "Updates, troubleshooting, performance improvements and ongoing technical support.",
  },
];

const projects = [
  {
    number: "01",
    name: "NOVA Sports Live",
    type: "Sports Media Platform",
    code: "NSL",
    description:
      "A regional sports platform built around scores, rankings, standings and team coverage.",
  },
  {
    number: "02",
    name: "DMV Attack",
    type: "Sports Organization",
    code: "DMA",
    description:
      "A digital home for teams, athletes, programs and organizational growth.",
  },
  {
    number: "03",
    name: "Coach Tae QB",
    type: "Athlete Development",
    code: "CTQ",
    description:
      "A focused training platform connecting athletes with quarterback development and coaching.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <a href="#" className="brand">
          <img src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" />
        </a>

        <nav>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#about">Studio</a>
        </nav>

        <a href="#contact" className="navAction">
          Start a project
          <span>↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow">
            <span className="pulse" />
            CRESTLANE / DIGITAL STUDIO
          </div>

          <h1>
            We build digital
            <br />
            <span>that works.</span>
          </h1>

          <p className="lead">
            Thoughtful design, modern development and practical technology for
            businesses ready for a stronger digital presence.
          </p>

          <div className="heroActions">
            <a href="#contact" className="primary">
              Start a project <span>↗</span>
            </a>

            <a href="#work" className="textLink">
              Explore our work <span>↓</span>
            </a>
          </div>

          <div className="microInfo">
            <span>DESIGN</span>
            <i />
            <span>DEVELOPMENT</span>
            <i />
            <span>TECHNOLOGY</span>
          </div>
        </div>

        <div className="systemPanel">
          <div className="panelTop">
            <div>
              <span className="dot blue" />
              <span className="dot" />
              <span className="dot" />
            </div>

            <span>CRESTLANE / SYSTEM</span>
          </div>

          <div className="panelBody">
            <div className="panelIntro">
              <span>PROJECT FRAMEWORK</span>
              <strong>BUILD / 001</strong>
            </div>

            <div className="orb">
              <div className="orbRing ring1" />
              <div className="orbRing ring2" />
              <div className="orbRing ring3" />

              <div className="orbCenter">
                <span>CL</span>
              </div>
            </div>

            <div className="systemRows">
              <div>
                <span>01</span>
                <p>STRATEGY</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>02</span>
                <p>DESIGN</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>03</span>
                <p>DEVELOPMENT</p>
                <strong>READY</strong>
              </div>

              <div>
                <span>04</span>
                <p>DEPLOYMENT</p>
                <strong>READY</strong>
              </div>
            </div>
          </div>

          <div className="panelBottom">
            <span>MODERN WEB SYSTEMS</span>
            <span>EST. 2026</span>
          </div>
        </div>
      </section>

      <section className="statement" id="about">
        <span className="sectionNumber">01 / STUDIO</span>

        <p>
          Crestlane sits at the intersection of
          <strong> design, technology and business.</strong> We create digital
          experiences that are clear, intentional and built to perform.
        </p>
      </section>

      <section className="services" id="services">
        <div className="sectionHeader">
          <span>02 / CAPABILITIES</span>
          <h2>What we do</h2>
        </div>

        <div className="serviceRows">
          {services.map((service) => (
            <article className="service" key={service.number}>
              <span>{service.number}</span>

              <h3>{service.title}</h3>

              <p>{service.text}</p>

              <div className="arrow">↗</div>
            </article>
          ))}
        </div>
      </section>

      <section className="support">
        <div className="supportHeader">
          <span>03 / ONGOING SUPPORT</span>

          <div>
            <h2>We don&apos;t disappear after launch.</h2>
            <p>
              Crestlane can continue supporting your digital presence after
              your website goes live, helping keep it secure, available and
              running the way it should.
            </p>
          </div>
        </div>

        <div className="supportGrid">
          <article>
            <span>01</span>
            <div className="supportIcon">
              <i className="statusLight" />
            </div>
            <h3>Uptime Monitoring</h3>
            <p>
              Ongoing availability checks to help identify website issues and
              unexpected downtime.
            </p>
          </article>

          <article>
            <span>02</span>
            <div className="supportIcon shieldIcon">◇</div>
            <h3>Security Hardening</h3>
            <p>
              Practical security configuration and preventative measures
              designed to reduce unnecessary exposure.
            </p>
          </article>

          <article>
            <span>03</span>
            <div className="supportIcon pulseIcon">
              <b />
              <b />
              <b />
            </div>
            <h3>Performance Checks</h3>
            <p>
              Regular reviews focused on speed, reliability and the overall
              experience of your website.
            </p>
          </article>

          <article>
            <span>04</span>
            <div className="supportIcon">↻</div>
            <h3>Ongoing Maintenance</h3>
            <p>
              Technical updates, troubleshooting and continued support as your
              business and website evolve.
            </p>
          </article>
        </div>

        <div className="supportStatus">
          <div>
            <i />
            <span>SYSTEM STATUS</span>
          </div>

          <strong>MONITORING ACTIVE</strong>
        </div>
      </section>

      <section className="work" id="work">
        <div className="sectionHeader">
          <span>04 / SELECTED WORK</span>
          <h2>Things we&apos;ve built</h2>
        </div>

        <div className="projects">
          {projects.map((project, index) => (
            <article
              className={`project ${index % 2 === 1 ? "reverse" : ""}`}
              key={project.name}
            >
              <div className="projectVisual">
                <div className="visualTop">
                  <span>CRESTLANE / {project.number}</span>
                  <span>{project.type}</span>
                </div>

                <div className="projectCode">{project.code}</div>

                <div className="visualLines">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <div className="visualCorner">
                  <span>BUILD</span>
                  <strong>{project.number}</strong>
                </div>
              </div>

              <div className="projectCopy">
                <span className="projectNumber">{project.number}</span>

                <p className="projectType">{project.type}</p>

                <h3>{project.name}</h3>

                <p className="projectDescription">{project.description}</p>

                <span className="projectLine" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="principles">
        <div>
          <span>FAST</span>
          <p>Built for performance.</p>
        </div>

        <div>
          <span>SECURE</span>
          <p>Technology built correctly.</p>
        </div>

        <div>
          <span>RESPONSIVE</span>
          <p>Designed for every screen.</p>
        </div>

        <div>
          <span>SCALABLE</span>
          <p>Ready for what comes next.</p>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contactLeft">
          <span>05 / START SOMETHING</span>

          <h2>
            Have an idea?
            <br />
            Let&apos;s build it.
          </h2>
        </div>

        <div className="contactRight">
          <p>
            Tell us what you&apos;re working on. We&apos;ll help turn the idea
            into a clean, functional digital experience.
          </p>

          <a href="mailto:hello@crestlanedigital.com">
            Start a conversation <span>↗</span>
          </a>
        </div>
      </section>

      <footer>
        <img src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" />

        <div>
          <span>DESIGN</span>
          <span>DEVELOPMENT</span>
          <span>TECHNOLOGY</span>
        </div>

        <p>© 2026 CRESTLANE DIGITAL</p>
      </footer>
    </main>
  );
}
