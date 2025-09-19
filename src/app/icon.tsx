import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'hsl(var(--background))',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
          borderRadius: '8px'
        }}
      >
        <div style={{ color: '#CE1126', fontSize: 9 }}>GHANA</div>
        <div style={{ color: '#FCD116', fontSize: 8 }}>★</div>
        <div style={{ color: '#006B3F', fontSize: 9 }}>MUST GO</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
