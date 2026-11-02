import React, { useState, useMemo, useEffect, memo } from "react";

import { Helmet } from "react-helmet";

import Loading from "../components/ui/loader";

import { useGitHubLeaderboardData } from "../hooks/GraphQlQuery";
import ContributorRoadmap from "../components/Leaderboard/ContributorRoadmap";

/* =========================
   ASSETS
========================= */

import CommunityChampion from "../assets/communitychampion.png";

import Conversationalist from "../assets/conversationalist.png";

import Initiator from "../assets/initiator.png";

import Superstar from "../assets/superstar.png";

import Supporter from "../assets/supporter.png";

import Joining from "../assets/join.png";

import search1 from "../assets/SearchIMg1.gif";

import search2 from "../assets/SearchIMG2.gif";

import search3 from "../assets/SearchIMG3.gif";

/* =========================
   CONSTANTS
========================= */

const rotatingImages = [search1, search2, search3];

const badges = [
  {
    src: CommunityChampion,
    name: "Champion",
    threshold: 40000,
  },

  {
    src: Conversationalist,
    name: "Speaker",
    threshold: 20000,
  },

  {
    src: Initiator,
    name: "Initiator",
    threshold: 10000,
  },

  {
    src: Superstar,
    name: "Superstar",
    threshold: 5000,
  },

  {
    src: Supporter,
    name: "Supporter",
    threshold: 2500,
  },

  {
    src: Joining,
    name: "Member",
    threshold: 0,
  },
];

/* =========================
   HELPERS
========================= */

function getBadgeInfoByScore(score) {
  for (const badge of badges) {
    if (score >= badge.threshold) {
      return badge;
    }
  }

  return badges[badges.length - 1];
}

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateLayout = (event) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  return isDesktop;
}

const ContributorListItem = memo(({ user, active, onSelect }) => {
  const badge = getBadgeInfoByScore(user.score);

  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      aria-pressed={active}
      aria-label={`Show ${user.username}'s roadmap`}
      className={`flex w-full min-w-0 items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
        active
          ? "bg-emerald-500/10 dark:bg-sky-400/10"
          : "bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
      }`}
      style={{ border: 0, color: "inherit" }}
    >
      <img
        src={`https://github.com/${user.username}.png`}
        alt=""
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-xl object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-rajdhani text-lg font-bold">{user.username}</span>
        <span className="block text-xs text-gray-500 dark:text-white/45">
          {user.score} TQ points
        </span>
      </span>
      <img src={badge.src} alt={badge.name} className="h-7 w-7 shrink-0 object-contain" />
    </button>
  );
});

/* =========================
   USER CARD
========================= */

const UserCard = memo(({ user, filterActive, onSelect }) => {
  const badge = getBadgeInfoByScore(user.score);

  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      aria-label={`View ${user.username}'s contribution roadmap`}
      className="group w-full cursor-pointer text-left"
      style={{
        background: "transparent",
        border: 0,
        padding: 0,
        color: "inherit",
      }}
    >
      <div
        className={`
            relative overflow-hidden rounded-[34px] border border-gray-300/45
            bg-white/10 p-[1px] shadow-[0_12px_40px_rgba(0,0,0,0.06)]
            backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2
            hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            dark:border-white/[0.1] dark:bg-white/[0.025] dark:shadow-black/20
            dark:hover:shadow-black/40
          `}
      >
        {/* SHINY BORDER */}

        <div
          className="
              absolute
              inset-0

              opacity-0

              transition-opacity
              duration-500

              group-hover:opacity-100
            "
        >
          <div
            className="
                absolute

                -left-[120%]
                top-0

                h-full
                w-[80%]

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
        </div>

        {/* CARD */}

        <div
          className="
              relative

              min-h-[340px]

              rounded-[33px]

              p-6

              flex
              flex-col
              items-center
              text-center

              overflow-hidden

              transition-all
              duration-500

              border border-white/40 bg-white/15 backdrop-blur-2xl
              dark:border-white/[0.06] dark:bg-black/10
            "
        >
          {/* DARK GLOW */}

          <div
            className="
                absolute

                inset-0

                dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]

                pointer-events-none
              "
          />


          {/* AVATAR */}

          <div
            className="
                relative

                mt-2
                mb-5

                h-24
                w-24

                overflow-hidden

                rounded-full

                border-2

                dark:border-white/[0.08]

                border-black/10

                transition-all
                duration-500

                group-hover:scale-105

                dark:group-hover:border-white/[0.18]

                group-hover:border-black/20
              "
          >
            <img
              src={`https://github.com/${user.username}.png`}
              alt={user.username}
              loading="lazy"
              className="
                  h-full
                  w-full

                  object-cover
                "
            />
          </div>

          {/* USERNAME */}

          <h2
            className="
                max-w-full

                truncate

                text-[1.35rem]

                font-black

                dark:text-white

                text-black

                font-rajdhani
              "
          >
            {user.username}
          </h2>

          {/* SCORE */}

          <div
            className="
                mt-4

                flex
                flex-col
                items-center
              "
          >
            <span
              className="
                  text-4xl

                  font-black

                  tracking-tight

                  dark:text-white

                  text-black
                "
            >
              {user.score}
            </span>

            <span
              className="
                  mt-1

                  text-[11px]

                  uppercase

                  tracking-[3px]

                  dark:text-white/40

                  text-black/45
                "
            >
              TQ Points
            </span>
          </div>

          {/* STATS */}

          {filterActive && (
            <div
              className="
                  mt-5
                "
            >
              <div
                className="
                    rounded-2xl

                    border

                    dark:border-white/[0.06]

                    border-black/5

                    dark:bg-white/[0.025]

                    bg-white/10

                    px-5
                    py-3

                    backdrop-blur-xl
                  "
              >
                <div
                  className="
                      text-base

                      font-black

                      dark:text-white

                      text-black
                    "
                >
                  {user.techquantaCommits}
                </div>

                <div
                  className="
                      mt-1

                      text-[10px]

                      uppercase

                      tracking-[2px]

                      dark:text-white/40

                      text-black/45
                    "
                >
                  Commits
                </div>
              </div>
            </div>
          )}

          {/* BADGE */}

          <div
            className="
                mt-auto

                flex
                items-center
                gap-3

                rounded-2xl

                border

                dark:border-white/[0.06]

                border-black/5

                dark:bg-white/[0.025]

                bg-white/10



                backdrop-blur-xl
              "
          >
            <img
              src={badge.src}
              alt={badge.name}
              className="
                  h-9
                  w-9

                  object-contain
                "
            />

            <span
              className="
                  text-sm

                  font-bold

                  dark:text-white

                  text-black
                "
            >
              {badge.name}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
});

/* =========================
   MAIN
========================= */

export default function Leaderboard() {
  const {
    userStats,
    loading,
    filterActive,
    error,
    allDataNull,
    fetchAllLeaderboardData,
  } = useGitHubLeaderboardData();

  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] = useState("scoreDesc");

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const isDesktop = useDesktopLayout();

  /* GIF ROTATION */

  useEffect(() => {
    if (selectedUser) {
      return undefined;
    }

    const interval = setInterval(() => {
      setImageIndex((i) => (i + 1) % rotatingImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  /* FILTER */

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(userStats)) {
      return [];
    }

    const query = search.trim().toLowerCase();

    const filtered = query
      ? userStats.filter((u) => u.username.toLowerCase().includes(query))
      : userStats;

    return [...filtered].sort((a, b) => {
      if (sortKey === "scoreDesc") {
        return b.score - a.score;
      }

      if (sortKey === "scoreAsc") {
        return a.score - b.score;
      }

      return a.username.localeCompare(b.username);
    });
  }, [userStats, search, sortKey]);

  /* LOADING */

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
        <Loading />
      </div>
    );
  }

  if (selectedUser && !isDesktop) {
    return (
      <ContributorRoadmap
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  if (selectedUser && isDesktop) {
    return (
      <div className="min-h-screen px-5 pb-8 pt-24">
        <Helmet>
          <title>{selectedUser.username}&apos;s Contribution Roadmap</title>
        </Helmet>
        <div className="mx-auto w-full max-w-[1700px]">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
            <aside className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] min-w-0 overflow-y-auto pr-2">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-sky-300">
                    Contributors
                  </p>
                  <h1 className="mt-1 font-rajdhani text-3xl font-black">Profiles</h1>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="text-sm font-semibold text-gray-600 underline underline-offset-4 hover:text-emerald-700 dark:text-white/60 dark:hover:text-sky-300"
                  style={{ background: "transparent", border: 0, padding: 0 }}
                >
                  All cards
                </button>
              </div>

              <label className="mb-3 block">
                <span className="sr-only">Search contributors</span>
                <input
                  type="search"
                  placeholder="Search profiles..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl bg-black/[0.04] px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:bg-black/[0.07] dark:bg-white/[0.06] dark:placeholder:text-white/40 dark:focus:bg-white/[0.1]"
                />
              </label>
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value)}
                aria-label="Sort contributor profiles"
                className="mb-4 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-sm font-semibold outline-none dark:bg-white/[0.06]"
              >
                <option value="scoreDesc">Highest points</option>
                <option value="scoreAsc">Lowest points</option>
                <option value="alphaAZ">A-Z name</option>
              </select>

              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <ContributorListItem
                    key={user.username}
                    user={user}
                    active={user.username === selectedUser.username}
                    onSelect={setSelectedUser}
                  />
                ))}
              </div>
            </aside>

            <section className="min-w-0" aria-label={`${selectedUser.username}'s roadmap`}>
              <ContributorRoadmap user={selectedUser} onBack={() => setSelectedUser(null)} embedded />
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden px-5 pb-8 pt-24">
      <Helmet>
        <title>Continue Your Open Source Journey</title>
      </Helmet>

      <div
        className="
          mx-auto

          max-w-[1550px]
        "
      >
        {/* HERO */}

        <div
          className="
            mb-12

            flex
            flex-col

            lg:flex-row

            lg:items-end

            lg:justify-between

            gap-8
          "
        >
          {/* LEFT */}

          <div
            className="
              max-w-[760px]
            "
          >
            <div
              className="
                mb-4

                inline-flex

                items-center
                gap-2

                rounded-full

                border

                border-white/10

                bg-black/30

                px-4
                py-2

                text-xs

                uppercase

                tracking-[3px]

                text-white/50

                backdrop-blur-2xl
              "
            >
              Open Source • Community • Growth
            </div>

            <h1
              className="
                text-5xl

                sm:text-6xl

                lg:text-7xl

                font-black

                leading-[0.95]

                tracking-[-0.05em]

                text-black

                dark:text-white

                font-rajdhani
              "
            >
              Continue Your
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
                Open Source
              </span>
              Journey.
            </h1>

            <p
              className="
                mt-6

                max-w-[620px]

                text-base

                leading-relaxed

                text-black/55

                dark:text-white/45
              "
            >
              Track your growth, contribute to projects, climb the leaderboard,
              and build your developer identity with the community.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              flex-wrap
              gap-4
            "
          >
            {/* SEARCH */}

            <div
              className="
                flex

                items-center
                gap-3

                rounded-[24px]

                border

                dark:border-white/[0.08]

                border-black/5

                dark:bg-black/15

                bg-white/15

                px-5
                py-4

                backdrop-blur-3xl
              "
            >
              <img
                src={rotatingImages[imageIndex]}
                alt=""
                className="
                  h-10
                  w-10

                  rounded-full

                  object-cover
                "
              />

              <input
                type="text"
                placeholder="
                  Search contributors...
                "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-[230px]

                  bg-transparent

                  outline-none

                  dark:text-white

                  text-black

                  placeholder:text-black/40

                  dark:placeholder:text-white/30
                "
              />
            </div>

            {/* SORT */}

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="
                rounded-[24px]

                border

                dark:border-white/[0.08]

                border-black/5

                dark:bg-black/15

                bg-white/15

                px-5
                py-4

                text-sm
                font-semibold

                dark:text-white

                text-black

                outline-none

                backdrop-blur-3xl
              "
            >
              <option value="scoreDesc">Highest Points</option>

              <option value="scoreAsc">Lowest Points</option>

              <option value="alphaAZ">A-Z Name</option>
            </select>
          </div>
        </div>

        {/* GRID */}

        {error ? (
          <div
            className="rounded-3xl border border-rose-300/60 bg-rose-50/70 p-6 text-rose-900 dark:border-rose-300/20 dark:bg-rose-300/[0.06] dark:text-rose-100"
            role="alert"
          >
            <p className="font-bold">The leaderboard could not be loaded.</p>
            <p className="mt-1 text-sm opacity-80">{error}</p>
            <button
              type="button"
              onClick={() => fetchAllLeaderboardData(true)}
              className="mt-4 rounded-full border border-current px-4 py-2 text-sm font-bold transition hover:bg-rose-900/10 dark:hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        ) : allDataNull ? (
          <div className="rounded-3xl border border-dashed border-gray-300/70 p-10 text-center text-gray-600 dark:border-white/15 dark:text-white/50">
            No contributor data is available yet. Please check back shortly.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300/70 p-10 text-center text-gray-600 dark:border-white/15 dark:text-white/50">
            No contributors match “{search.trim()}”.
          </div>
        ) : (
          <div
            className="
              grid

              gap-6

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-4
            "
          >
            {filteredUsers.map((user) => (
              <UserCard
                key={user.username}
                user={user}
                filterActive={filterActive}
                onSelect={setSelectedUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
