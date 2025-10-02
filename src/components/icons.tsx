import React from 'react';

export const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
        <g>
            <path 
                d="M 50,15 A 35,35 0 1 1 15,50" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="12" 
                strokeLinecap="round"
            />
            <path 
                d="M 50,15 A 35,35 0 0 0 85,50" 
                fill="none" 
                stroke="hsl(var(--accent))" 
                strokeWidth="12" 
                strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="10" fill="hsl(var(--primary))"/>
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