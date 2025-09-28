import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  const bagPattern = (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5L0 9H20L18 5H2Z" fill="#CE1126"/>
      <path d="M18 5L16 24H4L2 5Z" fill="url(#pattern0)"/>
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#gmg-pattern" transform="scale(0.0416667)"/>
        </pattern>
        <pattern id="gmg-pattern" viewBox="0 0 24 24" width="25%" height="25%" patternContentUnits="userSpaceOnUse">
            <path d="M0 0h12v12H0z" fill="#CE1126"/>
            <path d="M12 0h12v12H12z" fill="#fff"/>
            <path d="M0 12h12v12H0z" fill="#fff"/>
            <path d="M12 12h12v12H12z" fill="#006B3F"/>
        </pattern>
      </defs>
    </svg>
  );


  return new ImageResponse(
    (
      <div
        style={{
          background: 'hsl(var(--background))',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <div style={{ transform: 'scale(1.2)' }}>
          {bagPattern}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
