import React from 'react';

interface TripGenieLogoProps {
  className?: string;
  size?: number;
}

export const TripGenieLogo: React.FC<TripGenieLogoProps> = ({ className = "w-9 h-9", size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Deep Ocean / Cyan Circular Compass Ring */}
      <circle cx="24" cy="24" r="21" fill="url(#oceanGrad)" stroke="#18C8E8" strokeWidth="2" opacity="0.95" />
      
      {/* Compass cardinal ticks */}
      <path d="M24 6V9M24 39V42M6 24H9M39 24H42" stroke="#18C8E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Curved Route Path inside circle */}
      <path d="M14 30C18 32 24 32 30 26C34 22 32 16 26 14C22 12 16 16 18 22" stroke="#00B8A9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Compass Needle (Teal & Golden Sand) */}
      <path d="M24 13L27.5 24L24 35L20.5 24L24 13Z" fill="url(#tealNeedle)" />
      <path d="M24 13L20.5 24L24 35L24 13Z" fill="#18C8E8" opacity="0.4" />

      {/* Location Pin Marker at destination */}
      <path d="M29 18C27 18 25.5 19.5 25.5 21.5C25.5 24 29 27.5 29 27.5C29 27.5 32.5 24 32.5 21.5C32.5 19.5 31 18 29 18Z" fill="#FFC857" stroke="#071A2B" strokeWidth="1" />
      <circle cx="29" cy="21.5" r="1.2" fill="#071A2B" />

      {/* Center pivot */}
      <circle cx="24" cy="24" r="2.5" fill="#FFC857" stroke="#071A2B" strokeWidth="1" />

      <defs>
        <linearGradient id="oceanGrad" x1="3" y1="3" x2="45" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B2D42" />
          <stop offset="1" stopColor="#071A2B" />
        </linearGradient>
        <linearGradient id="tealNeedle" x1="24" y1="13" x2="24" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B8A9" />
          <stop offset="1" stopColor="#18C8E8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
