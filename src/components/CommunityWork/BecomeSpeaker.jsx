// BecomeSpeakerSection.jsx
import React, { useEffect, useRef, useState } from "react";
import becomeSpeakerImage from "../../assets/speaker-community.svg";

const BecomeSpeakerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        relative w-full overflow-hidden uniform-background-gradient px-4 py-16 font-rajdhani sm:px-8 sm:py-20 lg:px-12
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        ease-out transform transition-all duration-1000
      `}
      aria-label="Become a Speaker Section"
    >
      <svg
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[-50px] md:right-[-80px] w-[380px] h-[380px] opacity-15 animate-blobFloat"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill="url(#gradBlob2)"
        aria-hidden="true"
        style={{ zIndex: 0, filter: "blur(20px)" }}
      >
        <defs>
          <linearGradient id="gradBlob2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <path
          d="M41.7,-62.1C54.4,-52.8,63.8,-41.8,68.7,-29.7C73.7,-17.6,74.3,-4.4,71.1,7.9C67.9,20.2,60.9,31.6,53.2,41.8C45.4,52,37,61,26.2,65.6C15.3,70.2,2.1,70.4,-9.8,74.3C-21.6,78.2,-32.4,85.7,-39.1,83.1C-45.7,80.5,-48.3,67.8,-52.7,55.2C-57.1,42.5,-63.4,30,-63.3,18.8C-63.2,7.5,-56.6,-2.4,-53,-11.4C-49.3,-20.4,-48.7,-28.5,-44.1,-37.3C-39.5,-46,-30.9,-55.3,-21,-62.5C-11.2,-69.6,-5.6,-74.6,3.1,-78.3C11.8,-82,23.7,-84.1,41.7,-62.1Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="flex flex-col justify-center">
          <h2
            className="
              text-4xl sm:text-5xl font-space-grotesk font-extrabold tracking-tight
              bg-gradient-to-r from-primary to-tech-green bg-clip-text text-transparent
              animate-textShimmer drop-shadow-lg mb-8
            "
          >
            Become a Speaker
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-gray-700 dark:text-gray-300 font-space-grotesk max-w-lg">
            Share your expertise and passion with a vibrant community by hosting workshops, sessions, or talks. Whether you&apos;re an industry professional, educator, or enthusiast, this is your opportunity to inspire others, expand your network, and showcase your unique insights.
          </p>

          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSevjGT1Nh8mNyc8MBovZn3EX1X_9P85OmozpJTe6edUkRpPDw/viewform?usp=header",
                "_blank",
                "noopener,noreferrer"
              )
            }
            aria-label="Host a Workshop or Session"
            className="
              mt-8 flex w-full max-w-full items-center justify-center px-4 py-4 text-center text-sm leading-snug
              bg-gradient-to-r from-primary to-tech-green hover:from-tech-green hover:to-primary
              text-white font-semibold tracking-wide rounded-3xl shadow-md transition-all duration-300 ease-in-out
              transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-60 animate-pulseGlow
              sm:mt-10 sm:w-fit sm:px-6 sm:text-base
            "
          >
            🎤 Host a Workshop or Session
          </button>
        </div>

        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-lg cursor-pointer overflow-hidden rounded-3xl border border-white/20 shadow-lg perspective-800 lg:mx-0"
          onMouseMove={(e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
          }}
        >
          <img
            src={becomeSpeakerImage}
            alt="An illustrated speaker sharing ideas with a community"
            className="h-full w-full object-cover select-none"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        .animate-blobFloat {
          animation: blobFloat 15s ease-in-out infinite;
        }

        @keyframes textShimmer {
          0% { background-position: -400%; }
          100% { background-position: 400%; }
        }
        .animate-textShimmer {
          background-size: 400% 100%;
          animation: textShimmer 4s linear infinite;
        }

        .perspective-800 {
          perspective: 800px;
          transition: transform 0.2s ease-out;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 8px 2px rgba(52, 211, 153, 0.7);
          }
          50% {
            box-shadow: 0 0 14px 4px rgba(52, 211, 153, 1);
          }
        }
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BecomeSpeakerSection;
