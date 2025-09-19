import { ImageResponse } from 'next/og';
import { GhanaMustGoIcon } from '@/components/icons';

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
          fontSize: 24,
          background: '#003300',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          borderRadius: '8px'
        }}
      >
        <GhanaMustGoIcon 
          style={{
            width: '90%',
            height: '90%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
