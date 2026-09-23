const projects = [
  {
    number: "01",
    name: "NOVA Sports Live",
    category: "Sports Media Platform",
    description:
      "A digital platform for Northern Virginia high school sports, bringing scores, teams, rankings and coverage into one experience.",
    image: "/novasportslive.png",
    url: "https://novasportslive.com",
    domain: "novasportslive.com",
    fit: "cover",
  },
  {
    number: "02",
    name: "DMV Attack",
    category: "Sports Organization",
    description:
      "A modern digital home for a growing regional football organization built around athletes, teams and the DMV Attack brand.",
    image: "/dmvattack.jpeg",
    url: "https://dmvattack.com",
    domain: "dmvattack.com",
    fit: "cover",
  },
  {
    number: "03",
    name: "Coach Tae QB",
    category: "Athlete Development",
    description:
      "A focused training platform built around quarterback development, athlete growth and the Coach Tae brand.",
    image: "/CoachTaeqb.png",
    url: "https://coachtaeqb.com",
    domain: "coachtaeqb.com",
    fit: "cover",
  },
  {
    number: "04",
    name: "Maverick Athletics Training",
    category: "Performance Training",
    description:
      "A digital presence for athlete performance, training programs and the Maverick Athletics brand.",
    image: "/maverickathleticstraining.PNG",
    url: "https://www.maverickathleticstraining.com/",
    domain: "maverickathleticstraining.com",
    fit: "contain",
  },
  {
    number: "05",
    name: "Independent Pharmacy",
    category: "Concept Build",
    description:
      "A modern pharmacy concept focused on trust, accessibility and a simpler customer experience.",
    image: "",
    url: "",
    domain: "Crestlane Concept",
    fit: "cover",
  },
];

const services = [
  {
    number: "01",
    name: "Web Design",
    description:
      "Clean, distinctive digital experiences built around your brand and customers.",
  },
  {
    number: "02",
    name: "Development",
    description:
      "Fast, responsive websites built with modern technology and thoughtful architecture.",
  },
  {
    number: "03",
    name: "Digital Systems",
    description:
      "Practical digital solutions designed to improve how your business operates.",
  },
  {
    number: "04",
    name: "Security & Monitoring",
    description:
      "Website hardening, uptime awareness and preventative technical measures.",
  },
  {
    number: "05",
    name: "Ongoing Support",
    description:
      "Maintenance, improvements and technical support after your website goes live.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <div className="heroAtmosphere" />
        <div className="heroTexture" />

        <header className="header">
          <div className="brandSpace" aria-hidden="true" />

          <nav>
            <a href="#studio">Studio</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
          </nav>

          <a className="headerContact" href="mailto:sales@crstlanedigital.com">
            Start a project <span>↗</span>
          </a>
        </header>

        <div className="heroContent">
          <span className="heroLabel">CRESTLANE DIGITAL</span>

          <h1>
            Digital experiences
            <br />
            for what&apos;s next.
          </h1>
        </div>

        <div className="heroFoot">
          <span>DESIGN / DEVELOPMENT / DIGITAL SYSTEMS</span>

          <a href="#studio">
            EXPLORE <i>↓</i>
          </a>
        </div>
      </section>

      <section className="studio" id="studio">
        <div className="sectionLabel">
          <span>01</span>
          <p>THE STUDIO</p>
        </div>

        <div className="studioContent">
          <h2>
            Thoughtful technology.
            <br />
            <span>Built with purpose.</span>
          </h2>

          <div className="studioCopy">
            <p>
              Crestlane Digital is a creative technology studio building
              modern websites and digital systems for businesses ready to
              strengthen how they operate and show up online.
            </p>

            <p>
              We bring strategy, design, development and continued support
              together so the finished product looks right, works right and
              keeps moving forward.
            </p>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="sectionHeader">
          <div className="sectionLabel">
            <span>02</span>
            <p>CAPABILITIES</p>
          </div>

          <h2>
            From first idea
            <br />
            to <span>what comes next.</span>
          </h2>
        </div>

        <div className="serviceList">
          {services.map((service) => (
            <article key={service.number}>
              <span className="serviceNumber">{service.number}</span>

              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <span className="serviceArrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="work" id="work">
        <div className="sectionHeader workHeader">
          <div className="sectionLabel">
            <span>03</span>
            <p>SELECTED WORK</p>
          </div>

          <div>
            <h2>
              Things we&apos;ve
              <br />
              <span>put into the world.</span>
            </h2>

            <p className="workIntro">
              Selected websites, platforms and digital concepts designed and
              developed by Crestlane.
            </p>
          </div>
        </div>

        <div className="projectGrid logoGrid">
          {projects.map((project) =>
            project.url ? (
              <a
                className="logoProject"
                href={project.url}
                target="_blank"
                rel="noreferrer"
                key={project.number}
              >
                <div className="logoProjectTop">
                  <span>{project.number}</span>
                  <span>{project.category}</span>
                </div>

                <div className="logoProjectVisual">
                  <img
                    src={project.image}
                    alt={`${project.name} logo`}
                    className={
                      project.name === "Maverick Athletics Training"
                        ? "maverickLogo"
                        : ""
                    }
                  />
                </div>

                <div className="logoProjectBottom">
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.domain}</p>
                  </div>

                  <span className="logoProjectArrow">↗</span>
                </div>
              </a>
            ) : (
              <div className="logoProject conceptProject" key={project.number}>
                <div className="logoProjectTop">
                  <span>{project.number}</span>
                  <span>{project.category}</span>
                </div>

                <div className="logoProjectVisual conceptLogo">
                  <span>RX</span>
                </div>

                <div className="logoProjectBottom">
                  <div>
                    <h3>{project.name}</h3>
                    <p>CRESTLANE CONCEPT</p>
                  </div>

                  <span className="conceptMark">CONCEPT</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="support">
        <div className="supportContent">
          <div className="sectionLabel">
            <span>04</span>
            <p>BEYOND LAUNCH</p>
          </div>

          <h2>
            Built to launch.
            <br />
            <span>Ready to evolve.</span>
          </h2>

          <p className="supportIntro">
            A website should not become forgotten technology the day it goes
            live. Crestlane can stay involved with monitoring, maintenance,
            security and continued support.
          </p>
        </div>

        <div className="supportSystem">
          <div className="systemTop">
            <span>CRESTLANE / SUPPORT</span>

            <div>
              <i />
              AVAILABLE
            </div>
          </div>

          <div className="systemCenter">
            <div className="systemHalo haloOuter" />
            <div className="systemHalo haloInner" />

            <div className="systemCore">
              <i />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="systemItems">
            <div>
              <span>01</span>
              <p>UPTIME</p>
            </div>

            <div>
              <span>02</span>
              <p>SECURITY</p>
            </div>

            <div>
              <span>03</span>
              <p>MAINTENANCE</p>
            </div>

            <div>
              <span>04</span>
              <p>SUPPORT</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="contactAtmosphere" />

        <span className="contactLabel">05 / START SOMETHING</span>

        <h2>
          Have something
          <br />
          worth <span>building?</span>
        </h2>

        <div className="contactBottom">
          <p>
            Tell us what you&apos;re working on and where you want to take it.
          </p>

          <a href="mailto:sales@crstlanedigital.com">
            sales@crstlanedigital.com
            <span>↗</span>
          </a>
        </div>
      </section>

      <footer>
        <a href="#home">
          <img src="/CrestLaneDigitalLogo.jpeg" alt="Crestlane Digital" />
        </a>

        <nav>
          <a href="#studio">Studio</a>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
        </nav>

        <div className="footerOnline">
          <i />
          ONLINE
        </div>

        <p>© 2026 CRESTLANE DIGITAL</p>
      </footer>
    </main>
  );
}

function ProjectVisual({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <div className="projectVisual">
      <div className="browserBar">
        <div className="browserDots">
          <i />
          <i />
          <i />
        </div>

        <div className="browserAddress">
          <i />
          <span>{project.domain}</span>
        </div>

        <span className="browserMore">•••</span>
      </div>

      <div
        className={`projectScreen ${
          project.fit === "contain" ? "containImage" : ""
        }`}
      >
        {project.image ? (
          <img src={project.image} alt={`${project.name} preview`} />
        ) : (
          <div className="conceptVisual">
            <div className="conceptCross">+</div>
            <span>CRESTLANE / CONCEPT 01</span>
            <strong>RX</strong>
            <p>Independent Pharmacy</p>
          </div>
        )}

        <div className="screenSheen" />
      </div>
    </div>
  );
}
