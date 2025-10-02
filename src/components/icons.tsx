
import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
        <g>
            <rect x="15" y="30" width="70" height="50" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="4" rx="5" />
            <path d="M 20 35 H 80 M 20 45 H 80 M 20 55 H 80 M 20 65 H 80 M 20 75 H 80" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="10 5" />
            <path d="M 30 40 V 80 M 45 40 V 80 M 60 40 V 80 M 75 40 V 80" stroke="hsl(var(--destructive))" strokeWidth="4" strokeDasharray="10 5" />

            <path d="M 35 30 A 15 15 0 0 1 65 30" fill="none" stroke="hsl(var(--foreground))" strokeWidth="4" />
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
      <path d="M5 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM19 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z"/>
      <path d="M8 19h8"/>
      <path d="M19 14a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2z"/>
      <path d="M5 11v-5h8"/>
      <path d="M11 6L7 4"/>
      <path d="M13 11V4h-2"/>
    </svg>
);
