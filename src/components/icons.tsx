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
      viewBox="0 0 134 44"
      fill="none"
      {...props}
    >
      <path
        d="M2.99 22H1M26.99 22H25"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M15.5 13H19L22 19"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9.5 35a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        fill="hsl(var(--foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M34.5 35a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        fill="hsl(var(--foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M27 22H11l-2.5 9h21L27 22zM15.5 13l-4 9h4.5M22.5 22H24"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M117 22h16M133 22h-5"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M129 19l-4 8h-4l4-8h4zM117 22l-1 3h3l-2-3z"
        fill="hsl(var(--accent))"
      ></path>
      <path
        d="M112 28l-2 4h13l2-4H112zM128 17h-9l-2 5h13l-2-5z"
        fill="hsl(var(--foreground))"
      ></path>
      <path
        d="M110 32l-3 4h19l2-4H110zM107 41l5-5-3-4-5 5 3 4z"
        fill="hsl(var(--foreground))"
      ></path>
      <path
        d="M128 17l-3-5-4 4 3 5 4-4zM107 41l-2 3h22l-2-3H107z"
        fill="hsl(var(--foreground))"
      ></path>
      <path
        d="M114 12l3-6-4-3-3 6 4 3z"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M109 4l4 2-2 4-4-2 2-4z"
        fill="hsl(var(--foreground))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M93 16h15"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M102 11h-3"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M48 29H36"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M40 22H38"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M62 25H50"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M89 27h-6"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M75 19H62"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
);
