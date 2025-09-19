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
          fontSize: 8,
          background: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
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
        <div>GHANA</div>
        <div>MUST GO</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
