import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 70"
      {...props}
    >
        <text
            x="50%"
            y="35%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#CE1126"
        >
            GHANA
        </text>
        <path d="M50 45 L52.94 54.51 L62.56 54.51 L54.81 60.49 L57.75 70 L50 64.01 L42.25 70 L45.19 60.49 L37.44 54.51 L47.06 54.51 Z" fill="#FCD116"/>
        <text
            x="50%"
            y="90%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#006B3F"
        >
            MUST GO
        </text>
    </svg>
);


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
      <path d="M18.66 17.55c.23.4.24.89.02 1.31l-1.57 3.14c-.23.46-.7.7-1.19.7H6.08c-.49 0-.96-.24-1.19-.7l-1.57-3.14c-.22-.42-.21-.91.02-1.31l.93-1.61" />
      <path d="M17.5 13.33c-.22.37-.44.74-.66 1.11" />
      <path d="M13.33 6.67H9l3.33 6.66" />
      <path d="M6.33 13.33H4.5L3.33 11" />
      <path d="m14 4 3.33 4" />
      <path d="M12 2v2.67" />
      <path d="M7.33 4.67 6 2" />
      <circle cx="17.5" cy="9.5" r="1" />
      <circle cx="6.5" cy="9.5" r="1" />
    </svg>
);
