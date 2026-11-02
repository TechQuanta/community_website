import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import lightlogo from "../../assets/lightlogo.png";
import darklogo from "../../assets/darklogo.png";

const navItems = [
  { name: "Projects", link: "/open-source-contributions" },
  { name: "Community", link: "/community-work" },
  { name: "Leaderboard", link: "/leaderboard" },
  { name: "About", link: "/about" },
];

const joinUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSddiwCoTtyjxuvKq6nPvgE6FXDjlMAz-35X2w8XFqscTDcYuw/viewform?usp=header";

const linkClass = ({ isActive }) =>
  `!transition-none font-rajdhani text-base font-semibold uppercase tracking-wide ${
    isActive
      ? "!text-[#2ECC71] dark:!text-[#00BFFF]"
      : "!text-gray-700 hover:!text-[#2ECC71] dark:!text-gray-200 dark:hover:!text-[#00BFFF]"
  }`;

function Brand() {
  return (
    <NavLink to="/" end aria-label="TechQuanta home" className="flex items-center gap-2">
      <img src={darklogo} alt="" width={34} height={34} className="block dark:hidden" />
      <img src={lightlogo} alt="" width={34} height={34} className="hidden dark:block" />
      <span className="font-rajdhani text-lg font-bold !text-gray-900 dark:!text-white">
        TechQuanta
      </span>
    </NavLink>
  );
}

function JoinLink({ mobile = false }) {
  return (
    <a
      href={joinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`!transition-none inline-flex items-center justify-center rounded-full bg-[#2ECC71]/15 px-5 py-2 font-rajdhani font-bold !text-gray-900 hover:bg-[#2ECC71]/25 dark:bg-[#00BFFF]/15 dark:!text-white dark:hover:bg-[#00BFFF]/25 ${
        mobile ? "w-full" : "shrink-0"
      }`}
    >
      Join the Community
    </a>
  );
}

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/25 text-gray-900 backdrop-blur-md dark:bg-black/20 dark:text-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Brand />

        <div className="hidden items-center justify-end gap-6 lg:flex xl:gap-8">
          {navItems.map((item) => (
            <NavLink key={item.link} to={item.link} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
          <JoinLink />
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 dark:text-white lg:hidden"
          style={{ background: "transparent", border: 0, padding: 0, color: "inherit" }}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="bg-white/35 px-4 py-5 backdrop-blur-md dark:bg-black/35 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={linkClass}
              >
                {item.name}
              </NavLink>
            ))}
            <JoinLink mobile />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
