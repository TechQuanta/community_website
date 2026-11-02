import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Circle,
  GitCommitHorizontal,
  GitPullRequest,
  LockKeyhole,
  RefreshCw,
  Terminal,
} from "lucide-react";

const CONTRIBUTION_REPO =
  import.meta.env.VITE_CONTRIBUTION_REPO ||
  "TechQuanta/community_website";
const GITHUB_API_URL = "https://api.github.com";
const ACTIVITY_CACHE_MS = 60 * 1000;
const activityCache = new Map();

function normalizeRepositoryName(value) {
  return value.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
}

function githubRequestError(response, label) {
  if (response.status === 404) {
    return `The configured contribution repository could not be found on GitHub.`;
  }
  if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
    return `GitHub's public API rate limit was reached while loading ${label}. Please try again shortly.`;
  }
  return `GitHub could not load ${label} (HTTP ${response.status}).`;
}

async function getGitHubJson(url, headers, signal, label) {
  const response = await fetch(url, { headers, signal });
  if (!response.ok) {
    throw new Error(githubRequestError(response, label));
  }
  return response.json();
}

async function addMergeDetails(pullRequests, repositoryApiUrl, headers, signal) {
  const closedPullRequests = pullRequests
    .filter((pullRequest) => pullRequest.state === "closed" && !pullRequest.merged_at)
    .slice(0, 8);
  const details = await Promise.allSettled(
    closedPullRequests.map((pullRequest) =>
      getGitHubJson(
        `${repositoryApiUrl}/pulls/${pullRequest.number}`,
        headers,
        signal,
        `pull request #${pullRequest.number}`
      )
    )
  );
  const detailsByNumber = new Map();
  let detailsUnavailable = pullRequests.filter(
    (pullRequest) => pullRequest.state === "closed" && !pullRequest.merged_at
  ).length > closedPullRequests.length;

  details.forEach((detail, index) => {
    if (detail.status === "fulfilled") {
      detailsByNumber.set(closedPullRequests[index].number, detail.value);
    } else if (detail.reason?.name !== "AbortError") {
      detailsUnavailable = true;
    }
  });

  return {
    pullRequests: pullRequests.map((pullRequest) => ({
      ...pullRequest,
      merged_at:
        pullRequest.merged_at ??
        pullRequest.pull_request?.merged_at ??
        detailsByNumber.get(pullRequest.number)?.merged_at ??
        null,
    })),
    detailsUnavailable,
  };
}

function getRoadmapSteps(commits, pullRequests, repositoryName, reportedCommitCount = 0) {
  // A PR is also proof that the contributor has completed the first change.
  // The leaderboard's repository count is a useful fallback when GitHub has
  // not associated an older commit with the contributor's username yet.
  const hasCommit = commits.length > 0 || pullRequests.length > 0 || reportedCommitCount > 0;
  const hasPullRequest = pullRequests.length > 0;
  const hasMergedPullRequest = pullRequests.some((pullRequest) => pullRequest.merged_at);
  const nextStep = !hasCommit
    ? "first-change"
    : !hasPullRequest
      ? "pull-request"
      : !hasMergedPullRequest
        ? "review"
        : "next-contribution";

  return [
    {
      id: "first-change",
      title: "Stage, commit & push your first change",
      command: [
        "git add .",
        'git commit -m "feat: describe your change"',
        "git push origin <your-branch>",
      ].join("\n"),
      status: hasCommit ? "complete" : nextStep === "first-change" ? "current" : "locked",
      detail: hasCommit
        ? "A contribution from this member is recorded for this repository."
        : "Your first published commit completes these three commands together.",
    },
    {
      id: "pull-request",
      title: "Open a pull request",
      command: `gh pr create --repo ${repositoryName} --base main`,
      status: hasPullRequest ? "complete" : nextStep === "pull-request" ? "current" : "locked",
      detail: hasPullRequest
        ? "A pull request from this contributor was found."
        : "Unlocked once a commit is visible in the contribution repository.",
    },
    {
      id: "review",
      title: "Get your change reviewed and merged",
      command: "gh pr view --web",
      status: hasMergedPullRequest ? "complete" : nextStep === "review" ? "current" : "locked",
      detail: hasMergedPullRequest
        ? "A merged pull request was found."
        : "Your next milestone after opening a pull request.",
    },
    {
      id: "next-contribution",
      title: "Ship your next contribution",
      command: [
        "git switch main",
        "git pull upstream main",
        "git switch -c feat/your-next-change",
      ].join("\n"),
      status: nextStep === "next-contribution" ? "current" : "locked",
      detail:
        commits.length > 1
          ? `${commits.length} commits from this contributor are visible. Pick another improvement to keep going.`
          : "Start another small improvement after your first change is merged.",
    },
  ];
}

function statusPresentation(status) {
  if (status === "complete") {
    return {
      label: "Completed",
      Icon: Check,
      badge: "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
    };
  }
  if (status === "current") {
    return {
      label: "Up next",
      Icon: Circle,
      badge: "bg-sky-400/10 text-sky-700 dark:text-sky-300",
    };
  }
  return {
    label: "Locked",
    Icon: LockKeyhole,
    badge: "bg-gray-200/60 text-gray-500 dark:bg-white/[0.03] dark:text-white/40",
  };
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-transparent px-4 py-4 sm:px-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
        {label}
      </p>
      <p className="mt-1 font-rajdhani text-3xl font-bold">{value}</p>
    </div>
  );
}

function RoadmapStepCard({ step, index, variant }) {
  const { Icon, label, badge } = statusPresentation(step.status);
  const isUnlocked = variant === "unlocked";
  const isLockedPreview = variant === "locked-preview";

  return (
    <li
      className={`rounded-2xl bg-transparent p-4 sm:p-5 ${
        isLockedPreview ? "roadmap-locked-command relative overflow-hidden" : ""
      }`}
    >
      {isLockedPreview && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-sky-400/[0.05] dark:bg-sky-300/[0.04]"
        />
      )}
      <div className="relative flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${badge}`}
        >
          <Icon size={17} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
              Step {index + 1}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badge}`}>
              {label}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-white/55">
            {step.detail}
          </p>
          {isUnlocked ? (
            <code className="mt-3 block max-w-full overflow-x-auto whitespace-pre-line rounded-xl bg-transparent px-3 py-3 font-mono text-xs leading-6 text-emerald-800 dark:text-sky-200 sm:px-4">
              {step.command}
            </code>
          ) : isLockedPreview ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-white/40">
              <LockKeyhole size={14} aria-hidden="true" />
              This is the next command waiting to unlock.
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default function ContributorRoadmap({ user, onBack, embedded = false }) {
  const [activity, setActivity] = useState({
    cloneRepo: null,
    commits: [],
    pullRequests: [],
    pullRequestDetailsUnavailable: false,
    warnings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const repositoryName = useMemo(
    () => normalizeRepositoryName(CONTRIBUTION_REPO),
    []
  );
  const repositoryWebUrl = `https://github.com/${repositoryName}`;

  const loadActivity = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        if (!/^[\w.-]+\/[\w.-]+$/.test(repositoryName)) {
          throw new Error(
            "VITE_CONTRIBUTION_REPO must be configured as an owner/repository name."
          );
        }

        const cacheKey = `${repositoryName}:${user.username.toLowerCase()}`;
        const cachedActivity = activityCache.get(cacheKey);
        if (cachedActivity && Date.now() - cachedActivity.cachedAt < ACTIVITY_CACHE_MS) {
          setActivity(cachedActivity.data);
          return;
        }

        const headers = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };
        const repositoryApiUrl = `${GITHUB_API_URL}/repos/${repositoryName}`;
        const commitQuery = new URLSearchParams({
          author: user.username,
          per_page: "100",
          page: "1",
        });
        const issueQuery = new URLSearchParams({
          state: "all",
          creator: user.username,
          sort: "updated",
          direction: "desc",
          per_page: "100",
          page: "1",
        });
        const [commitsResult, issuesResult] = await Promise.allSettled([
          getGitHubJson(
            `${repositoryApiUrl}/commits?${commitQuery}`,
            headers,
            signal,
            "commit history"
          ),
          getGitHubJson(
            `${repositoryApiUrl}/issues?${issueQuery}`,
            headers,
            signal,
            "pull requests"
          ),
        ]);

        if (signal.aborted) {
          return;
        }
        if (commitsResult.status === "rejected" && issuesResult.status === "rejected") {
          throw new Error(
            commitsResult.reason?.message ||
              issuesResult.reason?.message ||
              "Unable to load GitHub contribution activity."
          );
        }

        const commits =
          commitsResult.status === "fulfilled" && Array.isArray(commitsResult.value)
            ? commitsResult.value.sort(
                (first, second) =>
                  new Date(second.commit.author?.date ?? 0) -
                  new Date(first.commit.author?.date ?? 0)
              )
            : [];
        const issues =
          issuesResult.status === "fulfilled" && Array.isArray(issuesResult.value)
            ? issuesResult.value
            : [];
        const pullRequests = issues.filter((issue) => issue.pull_request);
        const mergeActivity = await addMergeDetails(
          pullRequests,
          repositoryApiUrl,
          headers,
          signal
        );
        if (signal.aborted) {
          return;
        }
        const warnings = [];
        if (commitsResult.status === "rejected") {
          warnings.push("Commit messages are temporarily unavailable.");
        }
        if (issuesResult.status === "rejected") {
          warnings.push("Pull request data is temporarily unavailable.");
        }
        const nextActivity = {
          cloneRepo: null,
          commits,
          pullRequests: mergeActivity.pullRequests,
          pullRequestDetailsUnavailable: mergeActivity.detailsUnavailable,
          warnings,
        };
        activityCache.set(cacheKey, { cachedAt: Date.now(), data: nextActivity });
        setActivity(nextActivity);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load GitHub contribution activity.");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [repositoryName, user.username]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadActivity(controller.signal);
    return () => controller.abort();
  }, [loadActivity]);

  const reportedCommitCount = Number(user.techquantaCommits) || 0;
  const steps = getRoadmapSteps(
    activity.commits,
    activity.pullRequests,
    repositoryName,
    reportedCommitCount
  );
  const completedSteps = steps.filter((step) => step.status === "complete").length;
  const achievedSteps = steps.filter((step) => step.status === "complete");
  const unlockedStep = steps.find((step) => step.status === "current");
  const lockedPreviewStep = steps.find((step) => step.status === "locked");
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <main
      className={
        embedded
          ? "contributor-roadmap min-w-0 text-gray-900 dark:text-white"
          : "contributor-roadmap min-h-screen px-4 py-6 pt-20 text-gray-900 dark:text-white sm:px-6 sm:py-8 sm:pt-24 lg:px-8"
      }
    >
      <div className="mx-auto w-full max-w-none">
        {!embedded && (
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-gray-800 transition hover:-translate-x-1 hover:text-emerald-700 dark:text-white dark:hover:text-sky-300 sm:mb-7"
            style={{
              background: "transparent",
              border: 0,
              padding: "0.5rem 1rem",
              color: "inherit",
            }}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to leaderboard
          </button>
        )}

        <section className="overflow-hidden rounded-2xl bg-transparent sm:rounded-[32px]">
          <div className="relative px-4 py-6 sm:px-9 sm:py-10">
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <img
                src={`https://github.com/${user.username}.png`}
                alt={`${user.username}'s GitHub avatar`}
                className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20 sm:rounded-3xl"
              />
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-sky-300">
                  Contributor roadmap
                </p>
                <h1 className="break-words font-rajdhani text-3xl font-black tracking-tight sm:text-5xl">
                  {user.username}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-white/55">
                  Follow this contributor&apos;s progress through the project. Published
                  commit messages show completed work; each new milestone unlocks the
                  next command.
                </p>
              </div>
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 underline-offset-4 transition hover:text-emerald-700 hover:underline dark:text-white/80 dark:hover:text-sky-300 sm:w-fit"
              >
                GitHub profile <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="relative mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              <StatCard label="TQ points" value={user.score ?? 0} />
              <StatCard label="Repository commits" value={activity.commits.length || reportedCommitCount} />
              <StatCard label="Pull requests" value={activity.pullRequests.length} />
            </div>
          </div>

          <div className="grid gap-6 px-4 py-6 sm:gap-8 sm:px-9 sm:py-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-white/40">
                    The plan
                  </p>
                  <h2 className="mt-1 font-rajdhani text-3xl font-bold">Your contribution path</h2>
                </div>
                <a
                  href={repositoryWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-start gap-1 break-all text-sm font-semibold leading-5 text-emerald-700 underline underline-offset-4 dark:text-sky-300 sm:items-center"
                >
                  <span className="min-w-0">{repositoryName}</span>
                  <ArrowUpRight size={14} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true" />
                </a>
              </div>

              <div className="mb-4 rounded-2xl bg-transparent p-4 sm:p-5">
                <p className="text-sm font-bold">Start here</p>
                <code className="mt-2 block max-w-full overflow-x-auto whitespace-pre-line rounded-xl bg-transparent px-3 py-3 font-mono text-xs leading-6 text-emerald-800 dark:text-sky-200 sm:px-4">
                  {`gh repo fork ${repositoryName} --clone\ngit remote add upstream https://github.com/${repositoryName}.git`}
                </code>
                <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-white/45">
                  Fork the repository first, then use the next command that the roadmap unlocks.
                </p>
              </div>

              {activity.pullRequestDetailsUnavailable && !loading && !error && (
                <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-white/45">
                  GitHub could not verify merge details for older pull requests. Their
                  open/closed status and links are still shown below.
                </p>
              )}
              {activity.warnings.length > 0 && !loading && !error && (
                <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-white/45">
                  {activity.warnings.join(" ")}
                </p>
              )}
              {loading ? (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-transparent p-4 text-sm text-gray-600 dark:text-white/60 sm:p-5"
                  role="status"
                >
                  <RefreshCw className="animate-spin" size={17} aria-hidden="true" />
                  Checking public GitHub commits and pull requests…
                </div>
              ) : error ? (
                <div
                  className="rounded-2xl bg-transparent p-4 sm:p-5"
                  role="alert"
                >
                  <p className="font-semibold text-rose-800 dark:text-rose-200">{error}</p>
                  <button
                    type="button"
                    onClick={() => loadActivity(new AbortController().signal)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-rose-800 underline dark:text-rose-200"
                    style={{ background: "transparent", border: 0, padding: 0 }}
                  >
                    <RefreshCw size={14} aria-hidden="true" /> Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {achievedSteps.length > 0 && (
                    <section aria-labelledby="achieved-commands-title">
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                          Achieved
                        </p>
                        <h3 id="achieved-commands-title" className="mt-1 text-xl font-bold">
                          Completed milestones
                        </h3>
                      </div>
                      <ol className="space-y-3">
                        {achievedSteps.map((step) => (
                          <RoadmapStepCard
                            key={step.id}
                            step={step}
                            index={steps.indexOf(step)}
                            variant="achieved"
                          />
                        ))}
                      </ol>
                    </section>
                  )}

                  {unlockedStep && (
                    <section aria-labelledby="unlocked-command-title">
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                          Unlocked now
                        </p>
                        <h3 id="unlocked-command-title" className="mt-1 text-xl font-bold">
                          Your next command
                        </h3>
                      </div>
                      <ol>
                        <RoadmapStepCard
                          step={unlockedStep}
                          index={steps.indexOf(unlockedStep)}
                          variant="unlocked"
                        />
                      </ol>
                    </section>
                  )}

                  {lockedPreviewStep && (
                    <section aria-labelledby="locked-command-title">
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-white/40">
                          Coming next
                        </p>
                        <h3 id="locked-command-title" className="mt-1 text-xl font-bold">
                          Locked command
                        </h3>
                      </div>
                      <ol>
                        <RoadmapStepCard
                          step={lockedPreviewStep}
                          index={steps.indexOf(lockedPreviewStep)}
                          variant="locked-preview"
                        />
                      </ol>
                    </section>
                  )}
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl bg-transparent p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Terminal size={17} className="text-emerald-700 dark:text-sky-300" aria-hidden="true" />
                <h2 className="font-bold">Progress snapshot</h2>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <span className="text-sm text-gray-600 dark:text-white/55">Milestones</span>
                <span className="font-rajdhani text-2xl font-bold">
                  {completedSteps}/{steps.length}
                </span>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"
                role="progressbar"
                aria-label="Completed roadmap milestones"
                aria-valuemin={0}
                aria-valuemax={steps.length}
                aria-valuenow={completedSteps}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-white/40">
                Commands unlock from public commits and pull requests in this repository.
                GitHub cannot verify local-only commands or private activity.
              </p>
            </aside>
          </div>

          <section className="px-4 py-6 sm:px-9 sm:py-7">
            <div className="mb-4 flex items-center gap-2">
              <GitCommitHorizontal size={19} className="text-emerald-700 dark:text-sky-300" aria-hidden="true" />
              <h2 className="font-rajdhani text-2xl font-bold">
                Completed work from commit messages
              </h2>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-white/45">Loading commit messages…</p>
            ) : error ? (
              <p className="text-sm text-gray-500 dark:text-white/45">
                Commit messages are unavailable until GitHub activity loads.
              </p>
            ) : activity.commits.length ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {activity.commits.map((commit) => {
                  const message = commit.commit.message.split("\n")[0];
                  return (
                    <li
                      key={commit.sha}
                      className="rounded-xl bg-transparent p-4"
                    >
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-2 text-sm font-semibold text-gray-800 hover:text-emerald-700 dark:text-white/85 dark:hover:text-sky-300"
                      >
                        <GitCommitHorizontal size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="break-words">{message}</span>
                        <ArrowUpRight
                          size={13}
                          className="mt-0.5 shrink-0 opacity-50 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-xl p-5 text-sm text-gray-600 dark:text-white/50">
                No public commits by {user.username} are visible in {repositoryName} yet.
                The first pushed contribution will complete the first milestone.
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-transparent p-4 sm:mt-8 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitPullRequest size={18} className="text-emerald-700 dark:text-[#00BFFF]" aria-hidden="true" />
                  <h3 className="font-bold">Pull requests</h3>
                </div>
                <a
                  href={`${repositoryWebUrl}/pulls?q=is%3Apr+author%3A${encodeURIComponent(user.username)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-[#00BFFF]"
                >
                  View PRs on GitHub <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 dark:text-white/45">
                  Checking pull requests for {user.username}…
                </p>
              ) : error ? (
                <p className="text-sm text-gray-600 dark:text-white/55" role="status">
                  Pull request details could not be loaded. Use “View PRs on GitHub” to
                  see the repository&apos;s live PR list.
                </p>
              ) : activity.pullRequests.length > 0 ? (
                <ul className="grid gap-3 md:grid-cols-2">
                  {activity.pullRequests.map((pullRequest) => (
                    <li
                      key={pullRequest.id}
                      className="rounded-xl bg-transparent p-4"
                    >
                      <a
                        href={pullRequest.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-800 transition hover:text-emerald-700 dark:text-white/85 dark:hover:text-[#00BFFF]"
                      >
                        <span className="min-w-0">
                          <span className="mr-2 text-xs text-gray-500 dark:text-white/45">
                            #{pullRequest.number}
                          </span>
                          <span>{pullRequest.title}</span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            pullRequest.merged_at
                              ? "bg-purple-400/10 text-purple-700 dark:text-purple-300"
                              : pullRequest.state === "open"
                                ? "bg-[#2ECC71]/10 text-emerald-800 dark:text-emerald-300"
                                : "bg-white/10 text-gray-600 dark:text-white/55"
                          }`}
                        >
                          {pullRequest.merged_at
                            ? "Merged"
                            : pullRequest.state === "open"
                              ? "Open"
                              : "Closed"}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl p-4 text-sm text-gray-600 dark:text-white/50">
                  No pull requests from {user.username} have been found in {repositoryName}
                  yet. This list will show their PR status and review progress here.
                </p>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
