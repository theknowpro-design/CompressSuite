import { useEffect, useState } from "react";

/**
 * Logo component with compression animation
 * @param {Object} props - Component props
 * @param {boolean} [props.compressing=false] - Triggers compression animation when true
 * @returns {JSX.Element} The animated logo SVG
 */
function Logo({ compressing = false }) {
  const [isCompressing, setIsCompressing] = useState(false);

  // Trigger compression animation when compressing prop changes
  useEffect(() => {
    if (compressing) {
      setIsCompressing(true);
      const timeout = setTimeout(() => {
        setIsCompressing(false);
      }, 800);
      return () => clearTimeout(timeout);
    } else {
      setIsCompressing(false);
    }
  }, [compressing]);

  return (
    <div className="app-logo-wrap">
      <svg
        className={`app-logo ${isCompressing ? "logo-compress" : ""}`}
        viewBox="0 0 200 140"
        role="img"
        aria-label="CompressSuite Logo"
      >
        <defs>
          <linearGradient id="logo-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--logo-primary)" />
            <stop offset="100%" stopColor="var(--logo-secondary)" />
          </linearGradient>
          <linearGradient id="logo-secondary-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--logo-secondary)" />
            <stop offset="100%" stopColor="var(--logo-primary)" />
          </linearGradient>
          <linearGradient id="logo-panel-grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="var(--logo-primary)" />
            <stop offset="50%" stopColor="var(--logo-panel)" />
            <stop offset="100%" stopColor="var(--logo-primary)" />
          </linearGradient>
          <filter id="logo-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect className="logo-bg-plate" x="8" y="8" width="184" height="124" rx="28" />

        <g className="logo-glow-ring">
          <ellipse
            cx="100"
            cy="70"
            rx="82"
            ry="52"
            fill="none"
            stroke="var(--logo-accent)"
            strokeWidth="2"
          />
        </g>

        <g className="logo-frame">
          <path
            d="M28 50 C48 22 74 14 100 14 C126 14 152 22 172 50 C154 34 128 28 100 28 C72 28 46 34 28 50 Z"
            fill="url(#logo-primary-grad)"
          />
          <path
            className="logo-frame-highlight"
            d="M40 42 C58 28 78 24 100 24 C122 24 142 28 160 42 C146 34 124 32 100 32 C76 32 54 34 40 42 Z"
            fill="white"
          />
          <path
            d="M28 90 C48 118 74 126 100 126 C126 126 152 118 172 90 C154 106 128 112 100 112 C72 112 46 106 28 90 Z"
            fill="url(#logo-secondary-grad)"
          />
        </g>

        <g className="logo-media-panel" filter="url(#logo-soft-glow)">
          <path d="M18 70 L56 54 L56 86 Z" fill="url(#logo-panel-grad)" />
          <path d="M182 70 L144 54 L144 86 Z" fill="url(#logo-panel-grad)" />
          <rect x="52" y="56" width="96" height="28" rx="8" fill="url(#logo-panel-grad)" />
        </g>

        <g className="logo-compression-bars">
          <rect className="logo-bar logo-bar--1" x="78" y="60" width="8" height="20" rx="3" />
          <rect className="logo-bar logo-bar--2" x="96" y="54" width="8" height="32" rx="3" />
          <rect className="logo-bar logo-bar--3" x="114" y="60" width="8" height="20" rx="3" />
        </g>
      </svg>
    </div>
  );
}

export default Logo;
