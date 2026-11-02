import React, { useState, useEffect, memo } from "react";
import { ArrowUpRight, Github, PackageOpen } from "lucide-react";

/* =========================================
   CONSTANTS
========================================= */

const BASE_GITHUB_OWNER = "TechQuanta";

const mockProjectDefinition = {
  repoOwner: BASE_GITHUB_OWNER,

  repoName: "https://frame-avatars.vercel.app/",

  description:
    "A dedicated microservice for generating custom framed GitHub profile avatars using modern image processing libraries.",

  forks: 30,

  pulls: 20,

  stars: 10,

  openIssues: 15,

  language: "TypeScript",
};

const featuredProjects = [
  {
    name: "init-app",
    category: "Python library",
    description:
      "An interactive Python CLI for scaffolding backend projects with a guided setup and ready-to-use foundation.",
    detail: "pip install init-app",
    icon: PackageOpen,
    links: [
      { label: "PyPI package", href: "https://pypi.org/project/init-app/" },
      { label: "Contribute on GitHub", href: "https://github.com/TechQuanta/init-app" },
    ],
  },
  {
    name: "GitHub Avatar Frame",
    category: "Community project",
    description:
      "A service for creating custom framed GitHub profile avatars. Explore the app or contribute to its open-source repository.",
    detail: "Built with TypeScript",
    icon: Github,
    links: [
      { label: "Try the app", href: "https://frame-avatars.vercel.app/" },
      {
        label: "Contribute on GitHub",
        href: "https://github.com/TechQuanta/github-avatar-frame-api",
      },
    ],
  },
];

/* =========================================
   ICONS
========================================= */

const PullIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ForkIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 3v12a3 3 0 003 3h6" />
    <circle cx="6" cy="3" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const StarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
  </svg>
);

const IssueIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

/* =========================================
   FETCH
========================================= */

const fetchBaseContributorData = async () => {
  const url = `https://raw.githubusercontent.com/${BASE_GITHUB_OWNER}/github-avatar-frame-api/main/.all-contributorsrc`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const json = await response.json();

    return (json.contributors || []).map((c) => ({
      login: c.login,

      name: c.name || c.login,

      avatar: c.avatar_url || `https://github.com/${c.login}.png`,

      profileLink: `https://github.com/${c.login}`,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* =========================================
   CONTRIBUTOR TILE
========================================= */

const ContributorTile = memo(({ contributor, index }) => {
  const gradients = [
    "from-purple-500/20 to-pink-500/10",

    "from-cyan-500/20 to-blue-500/10",

    "from-orange-500/20 to-red-500/10",

    "from-emerald-500/20 to-teal-500/10",

    "from-pink-500/20 to-rose-500/10",

    "from-yellow-500/20 to-orange-500/10",
  ];

  return (
    <a
      href={contributor.profileLink}
      target="_blank"
      rel="noopener noreferrer"
      className="
          group

          relative

          overflow-hidden

          rounded-[32px]

          bg-transparent

          p-5

          transition-all
          duration-500

          hover:-translate-y-2

          shadow-[0_10px_40px_rgba(0,0,0,0.08)]

          dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
    >
      {/* Glow */}

      <div
        className={`
            absolute

            inset-0

            bg-gradient-to-br

            ${gradients[index % gradients.length]}

            opacity-50

            dark:opacity-30
          `}
      />

      {/* Shine */}

      <div
        className="
            absolute

            -left-[120%]
            top-0

            h-full
            w-[70%]

            rotate-12

            bg-gradient-to-r

            from-transparent

            via-white/20

            to-transparent

            transition-all
            duration-1000

            group-hover:left-[140%]
          "
      />

      {/* Avatar */}

      <div
        className="
            relative

            flex
            items-center
            justify-between
          "
      >
        <div
          className="
              relative

              h-16
              w-16

              overflow-hidden

              rounded-2xl

            "
        >
          <img
            src={contributor.avatar}
            alt={contributor.name}
            className="
                h-full
                w-full

                object-cover

                transition-transform
                duration-500

                group-hover:scale-110
              "
          />
        </div>

        {/* Online Dot */}

        <div
          className="
              h-3
              w-3

              rounded-full

              bg-emerald-400

              shadow-[0_0_20px_rgba(52,211,153,0.8)]
            "
        />
      </div>

      {/* Content */}

      <div className="relative mt-5">
        <h3
          className="
              truncate

              text-lg

              font-black

              text-black

              dark:text-white

              font-rajdhani
            "
        >
          {contributor.name}
        </h3>

        <p
          className="
              mt-1

              text-sm

              text-black/50

              dark:text-white/35

              font-mono
            "
        >
          @{contributor.login}
        </p>

        {/* Stats */}

        <div
          className="
              mt-5

              flex
              items-center
              gap-2
            "
        >
          <div
            className="
                rounded-full

                bg-black/[0.04]

                dark:bg-white/[0.04]

                px-3
                py-2

                text-[10px]

                font-bold

                uppercase

                tracking-[2px]

                text-black/60

                dark:text-white/45
              "
          >
            Contributor
          </div>

          <div
            className="
                rounded-full

                bg-black/[0.04]

                dark:bg-white/[0.04]

                px-3
                py-2

                text-[10px]

                font-bold

                uppercase

                tracking-[2px]

                text-black/60

                dark:text-white/45
              "
          >
            Open Source
          </div>
        </div>
      </div>
    </a>
  );
});

/* =========================================
   PROJECT HERO
========================================= */

const ProjectHero = ({ project }) => {
  const stats = [
    {
      label: "Pulls",
      value: project.pulls,
      icon: PullIcon,
      color: "text-emerald-400",
    },

    {
      label: "Forks",
      value: project.forks,
      icon: ForkIcon,
      color: "text-cyan-400",
    },

    {
      label: "Issues",
      value: project.openIssues,
      icon: IssueIcon,
      color: "text-rose-400",
    },

    {
      label: "Stars",
      value: project.stars,
      icon: StarIcon,
      color: "text-yellow-400",
    },
  ];

  return (
    <div
      className="
        relative

        overflow-hidden

        rounded-[40px]

        bg-transparent

        p-5

        sm:p-8
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute

          -right-20
          -top-20

          h-64
          w-64

          rounded-full



          blur-[120px]
        "
      />

      <div
        className="
          absolute

          bottom-0
          left-0

          h-48
          w-48

          rounded-full

          bg-cyan-500/10

          blur-[100px]
        "
      />

      {/* Top */}

      <div className="relative">
        <div
          className="
            inline-flex

            items-center
            gap-2

            rounded-full

            px-4
            py-2

            text-xs

            uppercase

            tracking-[3px]

            text-black/50

            dark:text-white/40
          "
        >
          Developer Command Center
        </div>

        <h1
          className="
            mt-6

            text-4xl

            sm:text-6xl

            lg:text-7xl

            font-black

            leading-[0.9]

            tracking-[-0.05em]

            text-black

            dark:text-white

            font-rajdhani
          "
        >
          Build The
          <span
            className="
              block

              bg-gradient-to-r

              from-purple-400

              via-pink-300

              to-orange-300

              bg-clip-text

              text-transparent
            "
          >
            Future Of
          </span>
          Open Source.
        </h1>

        <p
          className="
            mt-6

            max-w-[650px]

            text-base

            leading-relaxed

            text-black/60

            dark:text-white/45
          "
        >
          {project.description}
        </p>

        {/* Pills */}

        <div
          className="
            mt-8

            flex
            flex-wrap
            gap-3
          "
        >
          <div
            className="
              rounded-full

              bg-purple-500/10

              px-4
              py-2

              text-sm

              font-bold

              text-purple-500
            "
          >
            {project.language}
          </div>

          <div
            className="
              rounded-full

              bg-emerald-500/10

              px-4
              py-2

              text-sm

              font-bold

              text-emerald-500
            "
          >
            Active Project
          </div>

          <div
            className="
              rounded-full

              bg-orange-500/10

              px-4
              py-2

              text-sm

              font-bold

              text-orange-500
            "
          >
            Community Driven
          </div>
        </div>
      </div>

      {/* Stats Grid */}

      <div
        className="
          relative

          mt-12

          grid

          grid-cols-2

          gap-4
        "
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                  rounded-[28px]

                  bg-black/[0.03]

                  dark:bg-white/[0.03]

                  p-4

                  sm:p-5
                "
            >
              <div
                className="
                    flex
                    items-center
                    justify-between
                  "
              >
                <div>
                  <div
                    className="
                        text-3xl

                        font-black

                        text-black

                        dark:text-white
                      "
                  >
                    {stat.value}
                  </div>

                  <div
                    className="
                        mt-1

                        text-xs

                        uppercase

                        tracking-[2px]

                        text-black/45

                        dark:text-white/35
                      "
                  >
                    {stat.label}
                  </div>
                </div>

                <div
                  className={`
                      ${stat.color}
                    `}
                >
                  <Icon
                    className="
                        h-6
                        w-6
                      "
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}

      <a
        href="https://frame-avatars.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="
          relative

          mt-10

          inline-flex

          items-center
          gap-3

          rounded-[24px]

          bg-black

          dark:bg-white

          px-6
          py-4

          text-sm

          font-black

          text-white

          dark:text-black

          transition-all
          duration-300

          hover:scale-[1.03]
        "
      >
        See Project →
      </a>
    </div>
  );
};

/* =========================================
   MAIN APP
========================================= */

export default function App() {
  const [currentProject, setCurrentProject] = useState({
    ...mockProjectDefinition,

    contributors: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchBaseContributorData();

      setCurrentProject((prev) => ({
        ...prev,

        contributors: data,
      }));

      setTimeout(() => {
        setLoading(false);
      }, 700);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            text-xl

            font-black

            text-black

            dark:text-white
          "
        >
          Initializing  Hub...
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative

        min-h-screen

        overflow-x-hidden

        px-4
        pt-20
        pb-8

        sm:px-6
        sm:pt-24
        sm:pb-10
      "
    >

     
      <div
        className="
          absolute

          bottom-[-180px]
          left-[30%]

          h-[500px]
          w-[500px]

          rounded-full

          bg-pink-500/20

          blur-[180px]
        "
      />

      {/* MAIN */}

      <div
        className="
          relative

          z-10

          w-full
        "
      >
        <section aria-labelledby="projects-title" className="mb-12">
          <div className="mb-6">
            <p className="font-rajdhani text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-cyan-300">
              Find your next contribution
            </p>
            <h2
              id="projects-title"
              className="mt-2 font-rajdhani text-4xl font-black text-gray-900 dark:text-white sm:text-5xl"
            >
              Explore our projects
            </h2>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
              Browse what the community is building and choose a project that
              matches your interests.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((project) => {
              const Icon = project.icon;

              return (
                <article
                  key={project.name}
                  className="rounded-[28px] bg-gradient-to-br from-emerald-400/10 via-white/30 to-cyan-400/10 p-6 dark:via-white/[0.03] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        <Icon aria-hidden="true" size={15} />
                        {project.category}
                      </span>
                      <h3 className="mt-4 font-rajdhani text-3xl font-black text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 min-h-[3.5rem] leading-relaxed text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                  <p className="mt-4 font-mono text-sm text-gray-700 dark:text-gray-200">
                    {project.detail}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.links.map((link, index) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`!transition-none inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ${
                          index === project.links.length - 1
                            ? "bg-gray-900/5 !text-gray-900 hover:bg-gray-900/10 dark:bg-white/10 dark:!text-white dark:hover:bg-white/15"
                            : "bg-[#2ECC71] !text-gray-950 hover:bg-[#25b863]"
                        }`}
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden="true" size={16} />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* TOP */}

          <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* LEFT */}

          <div className="min-w-0">
            <ProjectHero project={currentProject} />
          </div>

          {/* RIGHT */}

          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            {currentProject.contributors
              .slice(0, 6)
              .map((contributor, index) => (
                <ContributorTile
                  key={contributor.login}
                  contributor={contributor}
                  index={index}
                />
              ))}
          </div>
        </div>

        {/* BOTTOM STRIP */}

        <div
          className="
            mt-8

            rounded-[40px]

            bg-transparent

            p-4

            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
            "
          >
          {currentProject.contributors.map(
  (contributor) => (

    <a
  key={contributor.login}

  href={contributor.profileLink}

  target="_blank"

  rel="noopener noreferrer"

  className="
    relative

    flex
    items-center
    justify-center
  "
>

  {/* AVATAR WRAPPER */}

  <div
    className="
      group

      relative

      flex
      items-center
      justify-center
    "
  >

    {/* TOOLTIP */}

    <div
      className="
        pointer-events-none

        absolute

        -top-14

        left-1/2

        z-50

        -translate-x-1/2
        translate-y-2

        opacity-0

        transition-all
        duration-300

        group-hover:translate-y-0

        group-hover:opacity-100
      "
    >

      {/* TOOLTIP BOX */}

      <div
        className="
          whitespace-nowrap

          rounded-full

          bg-black/95

          px-4
          py-2

          text-xs

          font-bold

          tracking-wide

          text-white

          shadow-[0_10px_40px_rgba(0,0,0,0.45)]

        "
      >
        {contributor.name}
      </div>

      {/* TOOLTIP ARROW */}

      <div
        className="
          mx-auto

          -mt-1

          h-3
          w-3

          rotate-45

          bg-black/95
        "
      />
    </div>

    {/* AVATAR */}

    <div
      className="
        relative

        h-16
        w-16

        overflow-hidden

        rounded-2xl

        transition-all
        duration-500

        group-hover:scale-110

        group-hover:-translate-y-1

        group-hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]
      "
    >

      <img
        src={contributor.avatar}

        alt={contributor.name}

        className="
          h-full
          w-full

          object-cover
        "
      />
    </div>
  </div>
</a>
  )
)}         </div>
        </div>
      </div>
    </div>
  );
}
