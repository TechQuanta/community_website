import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
// External Components - Defined or Stubbed
import Faq from "../components/LandingPage/Faq";
import CoreTeam from "../components/LandingPage/CoreTeam";
import Partners from "../components/LandingPage/Partners";
import BecomeSpeakerSection from "../components/CommunityWork/BecomeSpeaker";
import { ConfettiOverlay } from "../components/LandingPage/Socials";
import {
  FaDiscord,
  FaDocker,
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { ArrowUpRight, Code2, Github, Rocket, Sparkles, Users } from "lucide-react";

// Words focused on active contribution and creative roles for the Hero title
const words = [
  "Innovators",
  "Creators",
  "Coders",
  "Designers",
  "Writers",
  "Problem Solvers",
  "Your Ideas",
  "New Perspectives",
];


// Reusable Tailwind CSS classes for consistent styling
const BASE_BUTTON_CLASSES =
  "inline-flex w-full items-center justify-center rounded-lg bg-[#00BFFF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BFFF] dark:bg-white dark:text-black sm:w-auto";

// Gradient classes for the H1 text
const GRADIENT_TEXT_CLASSES =
  "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 dark:from-white dark:to-blue-300";

const HERO_SOCIAL_LINKS = [
  {
    label: "Discord",
    href: "https://discord.com/invite/WK3aftq5vg",
    icon: FaDiscord,
    color: "#4f46e5",
  },
  { label: "GitHub", href: "https://github.com/TechQuanta", icon: FaGithub, color: "#374151" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/techquanta-community",
    icon: FaLinkedinIn,
    color: "#1d4ed8",
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/CjMw4xiTuNTFBaDzMKpuIC",
    icon: FaWhatsapp,
    color: "#22c55e",
  },
  {
    label: "Docker Hub",
    href: "https://hub.docker.com/u/techquanta",
    icon: FaDocker,
    color: "#2563eb",
  },
];

const FEATURED_PROJECTS = [
  {
    name: "init-app",
    category: "Python CLI",
    year: "2025",
    badge: "Beginner-friendly",
    title: "Build your first backend project faster.",
    description:
      "init-app helps contributors scaffold production-ready projects with guided setup, modern conventions, and a clean developer experience for new open-source contributors.",
    highlights: ["CLI scaffolding", "Tailored templates", "Quick setup"],
    cta: "Contribute to init-app",
    href: "https://github.com/TechQuanta/init-app",
    accent: "#2ECC71",
  },
  {
    name: "GitHub Avatar Frame",
    category: "Community showcase",
    year: "2024",
    badge: "Creator-first",
    title: "Design standout developer identity experiences.",
    description:
      "This project turns open-source creativity into eye-catching GitHub profile art, making it a perfect space for designers, devs, and contributors to experiment together.",
    highlights: ["Profile art", "Web app", "Creative tools"],
    cta: "Explore the project",
    href: "https://frame-avatars.vercel.app/",
    accent: "#a855f7",
  },
  {
    name: "TechQuanta Community",
    category: "Platform & growth",
    year: "2025",
    badge: "Community-led",
    title: "Shape the next wave of contributor experiences.",
    description:
      "From events to collaboration spaces, this platform brings people together to learn, ship, and grow with meaningfully guided early contributions and real impact.",
    highlights: ["Events", "Community hub", "Contributor growth"],
    cta: "Join the mission",
    href: "https://techquanta.github.io/community-wall",
    accent: "#00bfff",
  },
];

const Home = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSocial, setActiveSocial] = useState(null);
  const socialAnimationTimer = useRef(null);
  const socialNavigationTimer = useRef(null);
  const wordTransitionTimer = useRef(null);

  // Video player specific states and refs
  const videoRef = useRef(null);
  // Base URL is used statically now, without any autoplay logic
  const videoSrc = `https://www.youtube.com/embed/pQkaoaI9Ljc?si=xITc7-aGS_N6SoLT&wmode=transparent`;
  // Removed: const [transformStyle, setTransformStyle] = useState({});

  // Cycle the hero focus word without leaving pending timers behind.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsAnimating(true);
      window.clearTimeout(wordTransitionTimer.current);
      wordTransitionTimer.current = window.setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(wordTransitionTimer.current);
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(socialAnimationTimer.current);
    window.clearTimeout(socialNavigationTimer.current);
  }, []);

  const animateSocialClick = (event, href, icon, color) => {
    event.preventDefault();
    window.clearTimeout(socialAnimationTimer.current);
    window.clearTimeout(socialNavigationTimer.current);

    setActiveSocial({ icon: React.createElement(icon), color });
    socialAnimationTimer.current = window.setTimeout(() => {
      setActiveSocial(null);
    }, 2000);
    socialNavigationTimer.current = window.setTimeout(() => {
      window.location.assign(href);
    }, 2000);
  };

  // Removed: Effect 2: IntersectionObserver (Autoplay/Pause video on scroll)
  // Removed: Effect 3: Mousemove parallax/tilt effect for the video card

  return (
    <div className="home-page bg-transparent">
      {activeSocial && (
        <ConfettiOverlay icon={activeSocial.icon} iconColor={activeSocial.color} />
      )}
      <Helmet>
        <title>
          TechQuanta - Crafting Open Source Futures | Join Our Community
        </title>
        <meta
          name="description"
          content="TechQuanta welcomes newcomers to open source. Build impactful projects, share your unique vision, and grow with our supportive global community. Your contributions power innovation!"
        />
        <meta
          property="og:title"
          content="TechQuanta - Crafting Open Source Futures"
        />
        <meta
          property="og:description"
          content="Join TechQuanta: Build impactful open-source projects, share your vision, and grow with our supportive global community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="TechQuanta - Crafting Open Source Futures"
        />
        <meta
          name="twitter:description"
          content="Join TechQuanta: Build impactful open-source projects, share your vision, and grow with our supportive global community."
        />
        <link rel="canonical" href="https://yourwebsite.com/" />
      </Helmet>

      {/* |----------------------------------------------------------------------
        | 1. HERO SECTION 
        |----------------------------------------------------------------------
        */}
      <section className="home-hero-section">
        <div className="home-hero-shell">
          <div className="home-hero-copy">
            <p className="home-hero-kicker">TechQuanta community</p>
            <h1 className="home-hero-title">
              <span className="home-hero-title-line">Crafting open-source futures</span>
              <span className="home-hero-title-line">
                with{" "}
                <span className="home-hero-animated-word-container" aria-live="polite">
                  <span
                    className={`home-hero-animated-word ${GRADIENT_TEXT_CLASSES} ${
                      isAnimating
                        ? "home-hero-animated-word-exit"
                        : "home-hero-animated-word-enter"
                    }`}
                  >
                    {words[currentWord]}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`home-hero-animated-bg ${
                      isAnimating
                        ? "home-hero-animated-bg-exit"
                        : "home-hero-animated-bg-enter"
                    }`}
                  />
                </span>
              </span>
            </h1>
            <p className="home-hero-description">
              <strong>TechQuanta</strong> welcomes newcomers to open source. Build
              impactful projects, share your unique vision, and grow with a
              supportive global community.
            </p>

            <div className="home-hero-cta">
              <button
                type="button"
                className={`${BASE_BUTTON_CLASSES} font-exo2`}
                onClick={() =>
                  window.open("https://techquanta.github.io/community-wall")
                }
              >
                <span>Make First Contribution</span>
              </button>

              <button
                type="button"
                className={`${BASE_BUTTON_CLASSES} font-exo2`}
                onClick={() => (window.location.href = "/community-work")}
              >
                <span>Explore Projects</span>
              </button>
            </div>
          </div>

          <aside className="home-hero-aside" aria-label="Community pathways">
            <p className="home-hero-aside-label">A place to start</p>
            <p className="home-hero-aside-title">Learn in public. Build together. Grow with purpose.</p>
            <ul className="home-hero-paths">
              <li>Find an approachable first contribution</li>
              <li>Meet collaborators across the community</li>
              <li>Turn momentum into meaningful work</li>
            </ul>

            <nav aria-label="TechQuanta social links" className="hero-social-rail">
              {HERO_SOCIAL_LINKS.map(({ label, href, icon: Icon, color }, index) => (
                <a
                  key={label}
                  href={href}
                  onClick={(event) =>
                    animateSocialClick(event, href, Icon, color)
                  }
                  aria-label={label}
                  title={label}
                  className="hero-social-link"
                  style={{ "--social-delay": `${index * 130}ms` }}
                >
                  <span className="hero-social-icon">
                    {React.createElement(Icon, { "aria-hidden": true })}
                  </span>
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </section>

      {/* |----------------------------------------------------------------------
        | 2. VISION SECTION (Video) - Width: max-w-6xl
        |----------------------------------------------------------------------
        */}
      <section className="pb-16 lg:px-16 bg-transparent">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 dark:text-blue dark:from-white text-purple-400 font-space-grotesk">
          Discover Our Vision
        </h2>
        <div className="video-card-container w-full max-w-5xl mx-auto relative group pointer-events-none">
          <div className="video-card-shadow-outer pointer-events-none"></div>

          <div className="video-shadow-inset aspect-video">
            <iframe
              ref={videoRef}
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ background: "transparent" }}
              className="w-full h-full pointer-events-auto"
            ></iframe>
          </div>
        </div>

        <section className="home-featured-section" aria-labelledby="featured-projects-title">
          <div className="home-featured-heading">
            <div>
              <p className="home-featured-kicker">Featured projects</p>
              <h3 id="featured-projects-title">Build, contribute, and grow together.</h3>
            </div>
            <a
              href="https://github.com/TechQuanta"
              target="_blank"
              rel="noreferrer"
              className="home-featured-all-link"
            >
              <Github aria-hidden="true" />
              View all repositories
            </a>
          </div>

          <div className="home-featured-grid">
            {FEATURED_PROJECTS.map((project, index) => (
              <article
                key={project.name}
                className="home-featured-card"
                style={{ "--project-accent": project.accent }}
              >
                <div className="home-featured-card-topline">
                  <span>0{index + 1}</span>
                  <span>{project.category}</span>
                </div>
                <div className="home-featured-card-title-row">
                  <Code2 aria-hidden="true" />
                  <span>{project.name}</span>
                </div>
                <p className="home-featured-card-year">
                  <Sparkles aria-hidden="true" />
                  {project.year} · {project.badge}
                </p>
                <h4>{project.title}</h4>
                <p className="home-featured-card-description">{project.description}</p>
                <ul className="home-featured-highlights" aria-label={`${project.name} highlights`}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="home-featured-card-footer">
                  <span className="home-featured-contributor-note">
                    <Users aria-hidden="true" />
                    Contributor-friendly
                  </span>
                  <a href={project.href} target="_blank" rel="noreferrer" className="home-featured-project-link">
                    {project.cta}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16">
          <BecomeSpeakerSection />
        </div>
      </section>

      {/* |----------------------------------------------------------------------
        | 5. CORE TEAM, PARTNERS, FAQ SECTION 
        |----------------------------------------------------------------------
        */}
      <section>
        <div>
          <div className="home-partners-wrapper mt-16">
            <Partners />
          </div>
          <div className="mt-16">
            <Faq />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
