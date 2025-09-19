import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <defs>
      <pattern
        id="checker"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="10" height="10" x="0" y="0" fill="#D42027" />
        <rect width="10" height="10" x="10" y="0" fill="hsl(var(--primary))" />
        <rect width="10" height="10" x="0" y="10" fill="hsl(var(--primary))" />
        <rect width="10" height="10" x="10" y="10" fill="#D42027" />
      </pattern>
    </defs>

    {/* Bag body */}
    <path
      d="M10 30 L10 90 L90 90 L90 30 L55 30 L50 20 L45 30 Z"
      fill="url(#checker)"
      stroke="hsl(var(--foreground))"
      strokeWidth="2"
    />
    
    {/* Handles */}
    <path
      d="M30 30 C 30 10, 40 10, 40 30"
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M60 30 C 60 10, 70 10, 70 30"
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Star in the middle */}
    <g transform="translate(50 60)" fill="#FCD116" stroke="#000" strokeWidth="1">
      <path d="M0 -10 L2.94 -4.05 L9.51 -3.09 L4.76 1.54 L5.88 8.09 L0 5 L-5.88 8.09 L-4.76 1.54 L-9.51 -3.09 L-2.94 -4.05 Z" />
    </g>
  </svg>
);


export const MopedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M14 4h-4l-2 5h12l-2-5Z" />
        <path d="M12 11V4" />
        <path d="M7 11h10" />
        <path d="M16 11.5a2.5 2.5 0 1 1-5 0" />
        <path d="M18.5 18a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Z" />
        <path d="M5.5 18a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Z" />
        <path d="M15 18h-1.5" />
        <path d="M6.5 18H8" />
        <path d="M11.5 18h-3.5a1 1 0 0 1-1-1V9.5" />
    </svg>
);
