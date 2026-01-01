import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?name=<name>&date=<date>
    const name = searchParams.get('name')?.slice(0, 100) || 'Verified Winner';
    const date = searchParams.get('date') || new Date().toLocaleDateString();

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a', // Dark background
            color: '#FFD700', // Gold text
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Gradient/Pattern */}
          <div
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
               backgroundSize: '100px 100px',
               opacity: 0.2,
             }}
          />

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #FFD700',
              borderRadius: '24px',
              padding: '60px 80px',
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              boxShadow: '0 0 80px rgba(255, 215, 0, 0.25)',
              maxWidth: '90%',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 20, color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '4px' }}>
              Official Result
            </div>

            <div style={{ fontSize: 80, fontWeight: 800, marginBottom: 30, textAlign: 'center', lineHeight: 1.1, color: '#FFD700', textShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
              {name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 10 }}>
              {/* Check Icon */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div style={{ fontSize: 32, color: '#22c55e', fontWeight: 'bold' }}>
                VERIFIED BY SORTEO PRO
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 40, color: '#666', fontSize: 24, letterSpacing: '2px' }}>
            sorteopro.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
