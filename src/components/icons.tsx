import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 80"
      {...props}
    >
      <defs>
        <path id="star-path" d="M50 5 L61.2 35.5 L95 40 L70 60 L78.5 95 L50 75 L21.5 95 L30 60 L5 40 L38.8 35.5 Z" />
      </defs>

      <g>
        <use href="#star-path" fill="black" opacity="0.15" transform="translate(0, -10) scale(0.8)" />
        <text
            x="50%"
            y="30%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#CE1126"
        >
            GHANA
        </text>
        <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#006B3F"
        >
            MUST GO
        </text>
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
