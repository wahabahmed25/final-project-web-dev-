interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function HunterHubLogo({ size = 40, className, style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Hunter Hub"
    >
      <defs>
        <linearGradient id="hhbg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5C2D8B" />
        </linearGradient>
        <filter id="hhshadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#3b0764" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="9" fill="url(#hhbg)" filter="url(#hhshadow)" />

      {/* White H — left bar */}
      <rect x="8.5"  y="9"  width="6" height="22" rx="1.8" fill="white" opacity="0.96" />
      {/* White H — right bar */}
      <rect x="25.5" y="9"  width="6" height="22" rx="1.8" fill="white" opacity="0.96" />
      {/* White H — crossbar */}
      <rect x="8.5"  y="16.5" width="23" height="7" rx="1.8" fill="white" opacity="0.96" />

      {/* Gold pin badge (top-right) */}
      <circle cx="31" cy="9.5" r="6" fill="#EEB111" />
      {/* Pin inner highlight */}
      <circle cx="31" cy="9.5" r="2.4" fill="white" opacity="0.95" />
    </svg>
  );
}
