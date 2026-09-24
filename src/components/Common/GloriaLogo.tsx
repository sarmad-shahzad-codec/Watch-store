import React from "react";

interface GloriaLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "gold";
  accentColor?: string;
  showTimes?: boolean;
  className?: string;
}

export const GloriaLogo: React.FC<GloriaLogoProps> = ({
  size = "md",
  variant = "dark",
  accentColor = "#8A7A5C",
  showTimes = true,
  className = "",
}) => {
  const isLight = variant === "light";
  const isGold = variant === "gold";

  const textColor = isLight
    ? "text-[#FDF4E3]"
    : isGold
    ? "text-[#D4AF37]"
    : "text-[#1C1C1B]";

  const subTextColor = isLight
    ? "text-[#C5A880]"
    : isGold
    ? "text-[#B08D4A]"
    : "text-[#1C1C1B]";

  const svgColor = isLight ? "#FDF4E3" : isGold ? "#D4AF37" : "#1C1C1B";
  const pinColor = isGold ? "#F2C27B" : accentColor;

  const config = {
    sm: {
      fontSize: "text-[20px] sm:text-[22px]",
      timesSize: "text-[6px]",
      timesTracking: "tracking-[4px] pl-[4px]",
      svgWidth: 14,
      svgHeight: 15,
      svgMargin: "mx-[1.5px] -mb-[1px]",
      glSpacing: "tracking-[1.5px]",
      riaSpacing: "tracking-[1.5px] -mr-[1.5px]",
    },
    md: {
      fontSize: "text-[25px] sm:text-[28px]",
      timesSize: "text-[7.5px]",
      timesTracking: "tracking-[5px] pl-[5px]",
      svgWidth: 17,
      svgHeight: 18,
      svgMargin: "mx-[2px] -mb-[1px]",
      glSpacing: "tracking-[2px]",
      riaSpacing: "tracking-[2px] -mr-[2px]",
    },
    lg: {
      fontSize: "text-[36px] sm:text-[44px]",
      timesSize: "text-[11px]",
      timesTracking: "tracking-[8px] pl-[8px]",
      svgWidth: 26,
      svgHeight: 28,
      svgMargin: "mx-[3px] -mb-[2px]",
      glSpacing: "tracking-[3px]",
      riaSpacing: "tracking-[3px] -mr-[3px]",
    },
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center leading-none select-none ${className}`}
    >
      <div
        className={`flex items-baseline font-serif font-semibold ${config.fontSize} ${textColor} leading-none`}
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        <span className={config.glSpacing}>GL</span>

        <svg
          width={config.svgWidth}
          height={config.svgHeight}
          viewBox="0 0 100 104"
          aria-hidden="true"
          className={`${config.svgMargin} shrink-0`}
        >
          <path
            fill={svgColor}
            fillRule="evenodd"
            d="M 50 2 A 47 50 0 1 0 50.001 2 Z M 50 5.5 A 37 46.5 0 1 1 49.999 5.5 Z"
          />
          <rect x="48.4" y="11" width="3.2" height="7.5" rx="1" fill={pinColor} />
          <circle cx="80" cy="52" r="2.2" fill={pinColor} />
          <circle cx="50" cy="91" r="2.2" fill={pinColor} />
          <circle cx="20" cy="52" r="2.2" fill={pinColor} />

          <path
            fill={svgColor}
            d="M 35.3 43.5 L 51.6 49.2 L 54.3 54.5 L 48.4 54.8 Z"
          />
          <path
            fill={pinColor}
            d="M 72.5 39 L 51.2 54.1 L 45.7 54.5 L 48.8 49.9 Z"
          />
          <circle cx="50" cy="52" r="3.6" fill={pinColor} />
          <circle cx="50" cy="52" r="1.4" fill={svgColor} />
        </svg>

        <span className={config.riaSpacing}>RIA</span>
      </div>

      {showTimes && (
        <span
          className={`font-sans font-semibold uppercase ${config.timesSize} ${config.timesTracking} ${subTextColor} mt-1`}
          style={{ fontFamily: "'Instrument Sans', 'Jost', sans-serif" }}
        >
          TIMES
        </span>
      )}
    </div>
  );
};

export default GloriaLogo;
