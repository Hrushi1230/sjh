import { IconKey } from "./editorialData";

interface IconProps {
  name: IconKey;
  className?: string;
  size?: number;
}

export function EditorialIcon({ name, className = "", size = 22 }: IconProps) {
  const strokeColor = "currentColor";
  const strokeWidth = "1.35";

  switch (name) {
    case "temples":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Kalasha & flag spire */}
          <path d="M12 2v2m0 0c-1.5 2-3 4-3 7h6c0-3-1.5-5-3-7z" />
          <path d="M12 2l2 1.5-2 1.5" />
          {/* Main Shikhara tiers */}
          <path d="M7 11h10l1 5H6l1-5z" />
          {/* Sanctum base & pillars */}
          <path d="M4 16h16v5H4v-5z" />
          <path d="M9 16v5m6-5v5" />
          {/* Base plinth */}
          <path d="M2 21h20" />
        </svg>
      );

    case "rituals":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Diya vessel */}
          <path d="M4 14c0 4.418 3.582 7 8 7s8-2.582 8-7H4z" />
          {/* Sacred flame */}
          <path d="M12 3c-1.8 2.5-3 4.5-3 6.5a3 3 0 0 0 6 0C15 7.5 13.8 5.5 12 3z" />
          {/* Radiance aura */}
          <path d="M12 1v1M7 5l.8.8M17 5l-.8.8" />
        </svg>
      );

    case "coastalCalm":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Primary coastal swell */}
          <path d="M2 10c3-2 6-2 9 0s6 2 9 0 3-1 3-1" />
          {/* Harmonious lower swell */}
          <path d="M2 15c3-2 6-2 9 0s6 2 9 0 3-1 3-1" />
          {/* Gentle sand edge */}
          <path d="M2 20c3-1.5 6-1.5 9 0s6 1.5 9 0" />
        </svg>
      );

    case "mountains":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Primary peak */}
          <path d="M3 20L10.5 5 18 20H3z" />
          {/* Snowcap ridge */}
          <path d="M8.5 9l2 2 2.5-2" />
          {/* Secondary background peak */}
          <path d="M14 12l4-7 4 15h-4" />
          <path d="M17 7.5l1.5 1.5 1.5-1.5" />
        </svg>
      );

    case "valleys":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Meandering river through alpine valley */}
          <path d="M2 6l7 8 5-6 8 12H2L2 6z" />
          <path d="M12 14c-1 2-1 4 1 6" />
          {/* Fine pine motif */}
          <path d="M19 14l2 3h-4l2-3zm0-3v3" />
        </svg>
      );

    case "tranquility":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Quiet lotus bloom */}
          <path d="M12 4c-1.5 3-3 6.5-3 9.5a3 3 0 0 0 6 0C15 10.5 13.5 7 12 4z" />
          <path d="M6.5 14.5c1.5-2 3.5-3.5 5.5-4 0 3-1.5 5.5-4 6a2.8 2.8 0 0 1-1.5-2z" />
          <path d="M17.5 14.5c-1.5-2-3.5-3.5-5.5-4 0 3 1.5 5.5 4 6a2.8 2.8 0 0 0 1.5-2z" />
          {/* Water ripples beneath */}
          <path d="M4 19.5c3-1 6-1 8 0s5 1 8 0" />
        </svg>
      );

    case "palaces":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Rajput jharokha dome */}
          <path d="M12 2c-2.5 2-4 4-4 6h8c0-2-1.5-4-4-6z" />
          <path d="M12 2v-1" />
          {/* Palace arches and pillars */}
          <path d="M5 8h14v13H5V8z" />
          <path d="M8 12c0-1.5 1-2.5 2-2.5s2 1 2 2.5v9H8v-9z" />
          <path d="M12 12c0-1.5 1-2.5 2-2.5s2 1 2 2.5v9h-4v-9z" />
          {/* Fortified parapet crenellations */}
          <path d="M3 8h2v2H3zm16 0h2v2h-2z" />
        </svg>
      );

    case "heritage":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Cusped Rajput gateway arch */}
          <path d="M4 21V9c0-3 3-5 8-7 5 2 8 4 8 7v12" />
          <path d="M7 21v-8c0-1.5 1.5-3 5-4.5 3.5 1.5 5 3 5 4.5v8" />
          <path d="M2 21h20" />
        </svg>
      );

    case "livingCulture":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Stylized ceremonial elephant & craft motif */}
          <path d="M4 14c0-4 3.5-7 8-7 3.5 0 6 2 7 4.5l2 4.5H19v4h-3v-3h-3v3H9v-3H6v3H4v-8z" />
          <path d="M18 13c-.5 1-1.5 1.5-2.5 1.5" />
          <path d="M12 7v5" />
          <path d="M10 9.5h4" />
        </svg>
      );

    case "backwaters":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Traditional Kettuvallam houseboat hull */}
          <path d="M2 16c2 2 6 3 10 3s8-1 10-3l-2-2H4l-2 2z" />
          {/* Arched woven thatched canopy */}
          <path d="M6 14c0-3.5 2.5-6 6-6s6 2.5 6 6" />
          <path d="M9 14v-4.5M15 14v-4.5" />
          {/* Gentle rippling water */}
          <path d="M2 20c3-1 6-1 10 0s7 1 10 0" />
        </svg>
      );

    case "nature":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Palm frond / gentle curved leaf */}
          <path d="M4 20C4 11 9 5 19 4c-1 9-7 15-15 16z" />
          <path d="M4 20c5-5 9-9 15-16" />
          <path d="M9 15c2-1 4-1 6-2" />
          <path d="M12 12c1.5-1 3-1 4.5-2" />
        </svg>
      );

    case "unhurriedDays":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {/* Gentle sun circle */}
          <circle cx="12" cy="12" r="4.5" />
          {/* Soft radiant rays */}
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      );

    default:
      return null;
  }
}
