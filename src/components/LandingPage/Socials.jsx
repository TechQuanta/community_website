import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// Import icons from react-icons
import { FaDiscord, FaGithub, FaWhatsapp, FaDocker, FaLinkedinIn } from 'react-icons/fa';

// Data for the community links, including title, icon, URL, description, and specific color classes for the card-like buttons.
const communityLinks = [
  {
    id: 'discord',
    title: 'Engage on Discord',
    description: 'Join real-time discussions, get support, and connect with peers.',
    icon: <FaDiscord />,
    url: 'https://discord.com/invite/WK3aftq5vg',
    iconColor: 'text-indigo-600',
    cardBgLight: '#e0e7ff', // bg-indigo-100
    cardBgDark: 'transparent', // dark:bg-indigo-900 - now transparent
    iconBoxBgLight: '#e5e7eb', // bg-gray-200
    iconBoxBgDark: 'transparent', // dark:bg-white
    hoverSliceColor: '#6366f1', // A shade of indigo for the animated slice
    glowColor: 'rgba(99, 102, 241, 0.2)', // Indigo glow
  },
  {
    id: 'github',
    title: 'Contribute on GitHub',
    description: 'Collaborate on open-source projects and enhance our codebases.',
    icon: <FaGithub />,
    url: 'https://github.com/TechQuanta',
    iconColor: 'text-gray-900',
    cardBgLight: '#f3f4f6', // bg-gray-100
    cardBgDark: 'transparent', // dark:bg-gray-900 - now transparent
    iconBoxBgLight: 'transparent',
    iconBoxBgDark: '#ffffff',
    hoverSliceColor: '#1f2937', // A shade of gray/black for the slice
    glowColor: 'rgba(31, 41, 55, 0.2)', // Dark gray glow
  },
  {
    id: 'whatsapp',
    title: 'Receive WhatsApp Updates',
    description: 'Stay informed with important announcements and quick insights.',
    icon: <FaWhatsapp />,
    url: 'https://chat.whatsapp.com/CjMw4xiTuNTFBaDzMKpuIC',
    iconColor: 'text-green-500',
    cardBgLight: '#dcfce7', // bg-green-100
    cardBgDark: 'transparent', // dark:bg-green-900 - now transparent
    iconBoxBgLight: 'transparent',
    iconBoxBgDark: 'transparent',
    hoverSliceColor: '#29da6dff', // A shade of green for the slice
    glowColor: 'rgba(34, 197, 94, 0.2)', // Green glow
  },
  {
    id: 'docker',
    title: 'Explore Container Projects',
    description: 'Access our latest containerized applications and demos.',
    icon: <FaDocker />,
    url: 'https://hub.docker.com/u/techquanta',
    iconColor: 'text-blue-600',
    cardBgLight: '#dbeafe', // bg-blue-100
    cardBgDark: 'transparent', // dark:bg-blue-900 - now transparent
    iconBoxBgLight: 'transparent',
    iconBoxBgDark: 'transparent',
    hoverSliceColor: '#4e88e4ff', // A shade of blue for the slice
    glowColor: 'rgba(59, 130, 246, 0.2)', // Blue glow
  },
  {
    id: 'linkedin',
    title: 'Connect on LinkedIn',
    description: 'Network with professionals and find career opportunities.',
    icon: <FaLinkedinIn />,
    url: 'https://www.linkedin.com/in/techquanta-community',
    iconColor: 'text-blue-700',
    cardBgLight: '#dbeafe', // bg-blue-100
    cardBgDark: 'transparent', // dark:bg-blue-900 - now transparent
    iconBoxBgLight: 'transparent',
    iconBoxBgDark: 'transparent',
    hoverSliceColor: '#1d4ed8', // A shade of darker blue for the slice
    glowColor: 'rgba(29, 78, 216, 0.2)', // Darker blue glow
  },
];

const SOCIAL_RAIN_ICONS = [
  { icon: <FaDiscord />, color: "#4f46e5" },
  { icon: <FaGithub />, color: "#111827" },
  { icon: <FaWhatsapp />, color: "#22c55e" },
  { icon: <FaDocker />, color: "#2563eb" },
  { icon: <FaLinkedinIn />, color: "#1d4ed8" },
];

// Confetti component for the visual effect - now accepts an icon to render
export const ConfettiOverlay = ({ icon: ConfettiIcon, iconColor, duration = 2 }) => {
  const rainColor = {
    "text-indigo-600": "#4f46e5",
    "text-gray-900": "#111827",
    "text-green-500": "#22c55e",
    "text-blue-600": "#2563eb",
    "text-blue-700": "#1d4ed8",
  }[iconColor] || iconColor;

  const confettiPieces = React.useMemo(
    () =>
      Array.from({ length: 84 }).map((_, index) => {
        const selectedIcon = index % 4 === 0;
        const rainIcon = selectedIcon
          ? { icon: ConfettiIcon, color: rainColor }
          : SOCIAL_RAIN_ICONS[index % SOCIAL_RAIN_ICONS.length];
        const size = Math.floor(Math.random() * 16) + 14;
        const style = {
          left: `${Math.random() * 100}vw`,
          // Start drops throughout the viewport immediately, so the effect is
          // visible on large desktop screens as soon as a social link is clicked.
          animationDelay: `-${(Math.random() * duration).toFixed(2)}s`,
          animationDuration: `${(1.5 + Math.random() * 0.9).toFixed(2)}s`,
          "--rain-drift": `${Math.round((Math.random() - 0.5) * 28)}vw`,
          "--rain-spin": `${Math.round(360 + Math.random() * 720)}deg`,
          color: rainIcon.color,
          opacity: 0.75 + Math.random() * 0.25,
        };

        return (
          <div key={index} className="social-icon-rain" style={style}>
            {React.cloneElement(rainIcon.icon, {
              "aria-hidden": true,
              style: { width: size, height: size },
            })}
          </div>
        );
      }),
    [ConfettiIcon, duration, rainColor]
  );

  const overlay = (
    <div className="pointer-events-none fixed inset-0 z-[2147483647] overflow-hidden" aria-hidden="true">
      <style>
        {`
        @keyframes social-icon-rain {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(0deg) scale(0.72);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--rain-drift), 115vh, 0) rotate(var(--rain-spin)) scale(1);
            opacity: 0;
          }
        }

        .social-icon-rain {
          position: absolute;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation-name: social-icon-rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          pointer-events: none;
          will-change: transform, opacity;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.35));
        }

        `}
      </style>
      {confettiPieces}
    </div>
  );

  // A portal prevents desktop containers with transforms, filters, or overflow
  // from creating a stacking context that can hide a fixed-position animation.
  return typeof document === 'undefined' ? overlay : createPortal(overlay, document.body);
};

// Main Community Join Section Component: Renders the UI for joining the community.
const CommunityJoinSection = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null); // State to store the icon to display
  const [selectedIconColor, setSelectedIconColor] = useState(''); // State to store the icon color

  // Handle click for redirection with Confetti effect
  const handleClick = (e, url, icon, iconColor) => {
    e.preventDefault();
    setSelectedIcon(icon); // Set the icon to be displayed as confetti
    setSelectedIconColor(iconColor); // Set the color for the icon confetti
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      setSelectedIcon(null); // Clear the icon state
      setSelectedIconColor(''); // Clear the color state
      window.location.assign(url);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-space-grotesk transition-colors duration-300">

      <div className="bg-transparent rounded-xl py-0">
        <ul className="">
          {communityLinks.map((link) => (
            <li
              key={link.id}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between
                py-3 px-4
                bg-transparent dark:bg-transparent
                transition-all duration-200 ease-in-out
                border-t border-b border-gray-200 dark:border-gray-700
                hover:shadow-md /* Removed hover:scale-[1.005] to let the glow be the primary effect */
                transform origin-center
                relative strip-hover-glow" /* Added relative and strip-hover-glow class */
              style={{ '--glow-color': link.glowColor }} /* Pass glow color as CSS variable */
            >
              {/* Left Side: Title and Description */}
              <div className="flex flex-col items-start mb-2 md:mb-0">
                {/* Title */}
                <span className="text-lg font-normal text-gray-900 dark:text-white font-space-grotesk
                                 relative inline-block
                                 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px]
                                 after:bg-current
                                 after:transition-all after:duration-300 after:ease-in-out
                                 group-hover:after:w-full">
                  {link.title}
                </span>
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-space-grotesk font-thin">
                  {link.description}
                </p>
              </div>

              {/* Right Side - Desktop Button: Unique Shape with Animation */}
              <a
                href={link.url}
                onClick={(e) => handleClick(e, link.url, link.icon, link.iconColor)}
                className={`animated-button hidden md:inline-flex`} /* Apply custom class, remove Tailwind width/height here */
                style={{
                  '--card-bg-light': link.cardBgLight,
                  '--card-bg-dark': link.cardBgDark,
                  '--hover-slice-color': link.hoverSliceColor,
                  '--icon-box-bg-light': link.iconBoxBgLight,
                  '--icon-box-bg-dark': link.iconBoxBgDark,
                }}
                aria-label={`Go to ${link.title}`}
              >
                {/* Inner Icon Box: Adapts background color based on theme and counter-skews */}
                <div className="icon-content"> {/* Tailwind padding removed, now in custom CSS */}
                  {React.cloneElement(link.icon, { className: `h-5 w-5 ${link.iconColor}` })}
                </div>
              </a>

              {/* Right Side - Mobile Link: Visible on small screens. */}
              <a
                href={link.url}
                onClick={(e) => handleClick(e, link.url, link.icon, link.iconColor)}
                className="md:hidden flex items-center justify-start w-full
                  text-blue-600 dark:text-blue-400 font-normal
                  hover:underline mt-2
                  transition-colors duration-200 font-space-grotesk"
              >
                {link.title.includes('on ') ? link.title.split('on ')[1] : link.title.includes('Receive ') ? link.title.split('Receive ')[1] : link.title.includes('Explore ') ? link.title.split('Explore ')[1] : link.title}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Confetti Overlay - now conditionally renders the icon */}
      {showConfetti && selectedIcon && (
        <ConfettiOverlay icon={selectedIcon} iconColor={selectedIconColor} />
      )}
    </div>
  );
};

export default CommunityJoinSection;
