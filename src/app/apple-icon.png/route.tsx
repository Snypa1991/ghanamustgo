import { ImageResponse } from 'next/og';
import { AppLogo } from '@/components/icons';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
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
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          padding: '12px'
        }}
      >
        <AppLogo />
      </div>
    ),
    {
      ...size,
    }
  );
}
