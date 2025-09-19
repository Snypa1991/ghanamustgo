import React from 'react';

export const GhanaMustGoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
        {/* Bag shape with gradient for 3D effect */}
        <defs>
            <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.95}} />
                <stop offset="100%" style={{stopColor: '#E0E0E0', stopOpacity: 0.9}} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <path
            d="M10,20 Q5,20 5,25 L5,85 Q5,90 10,90 L90,90 Q95,90 95,85 L95,25 Q95,20 90,20 Z"
            fill="url(#bagGradient)"
            stroke="#BDBDBD"
            strokeWidth="0.5"
            style={{filter: 'url(#shadow)'}}
        />

        {/* Zip lock top */}
        <rect x="5" y="10" width="90" height="10" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="0.5"/>
        <rect x="12" y="12" width="76" height="6" fill="#757575" rx="1" />
        <rect x="85" y="11" width="8" height="8" fill="#9E9E9E" stroke="#757575" strokeWidth="0.5" rx="1" />

        {/* Text */}
        <text
            x="50"
            y="45"
            fontFamily="Poppins, sans-serif"
            fontSize="14"
            fontWeight="bold"
            fill="black"
            textAnchor="middle"
        >
            GHANA
        </text>
        <text
            x="50"
            y="65"
            fontFamily="Poppins, sans-serif"
            fontSize="14"
            fontWeight="bold"
            fill="black"
            textAnchor="middle"
        >
            MUST GO
        </text>
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
        <path d="M19 17h.01" />
        <path d="M6 17h.01" />
        <path d="M12 12v-2" />
        <path d="M14 8.5h-4.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6.5" />
        <path d="M18 19c-2.8 0-5-2.2-5-5v-4" />
        <path d="M12 17a4 4 0 0 0 4-4v-2" />
        <path d="M14 5a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1" />
    </svg>
);
