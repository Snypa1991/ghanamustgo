import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 80"
      {...props}
    >
      <defs>
        <pattern id="gmg-pattern" viewBox="0 0 24 24" width="20%" height="25%" patternContentUnits="userSpaceOnUse">
          <path d="M0 0h12v12H0z" fill="#CE1126"/>
          <path d="M12 0h12v12H12z" fill="#fff"/>
          <path d="M0 12h12v12H0z" fill="#fff"/>
          <path d="M12 12h12v12H12z" fill="#003087"/>
        </pattern>
      </defs>

      <g transform="translate(10, 10)">
        {/* Bag Body */}
        <path d="M12 25L8 30 H62 L58 25 H12Z" fill="#CE1126"/>
        <path d="M58 25 L50 65 H20 L12 25 Z" fill="url(#gmg-pattern)"/>
        {/* Handles */}
        <path d="M28 25L30 18 H40 L42 25" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </g>
      
      <g transform="translate(75, 5)">
        <text
            x="0"
            y="35"
            dominantBaseline="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#CE1126"
        >
            GHANA
        </text>
        <text
            x="0"
            y="60"
            dominantBaseline="middle"
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
