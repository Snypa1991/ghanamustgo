import React from 'react';

export const MopedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="6" cy="18" r="3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M12 18h-3.5" />
    <path d="m19 18-3-8-4 2 2 4h-2.5" />
    <path d="M10 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    <path d="M12 8h5" />
  </svg>
);
