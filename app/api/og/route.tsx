import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?name=<name>&date=<date>
    const name = searchParams.get('name')?.slice(0, 100) || 'Verified Winner';
    const dateParam = searchParams.get('date');

    let dateStr = new Date().toLocaleDateString();
    if (dateParam) {
        const d = new Date(dateParam);
        if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString();
        }
    }

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
            backgroundColor: '#050505', // Deep dark
            backgroundImage: 'radial-gradient(circle at 50% 0%, #332a00 0%, #050505 70%)', // Gold glow from top
            color: '#FFD700', // Gold text
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Decorative Background Elements (Confetti-ish) */}
          <div style={{ position: 'absolute', top: 50, left: 50, fontSize: 60, opacity: 0.2 }}>✨</div>
          <div style={{ position: 'absolute', top: 100, right: 80, fontSize: 80, opacity: 0.2 }}>🎉</div>
          <div style={{ position: 'absolute', bottom: 100, left: 100, fontSize: 70, opacity: 0.1 }}>🏆</div>
          <div style={{ position: 'absolute', bottom: 50, right: 50, fontSize: 50, opacity: 0.2 }}>✨</div>

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '30px',
              padding: '50px 70px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 100px rgba(255, 215, 0, 0.1)',
              maxWidth: '90%',
              position: 'relative',
            }}
          >
            {/* Top Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: 20,
              padding: '10px 24px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '50px',
              border: '1px solid rgba(255, 215, 0, 0.2)',
            }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                <div style={{ fontSize: 20, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                    Official Verified Result
                </div>
            </div>

            {/* Winner Name */}
            <div style={{
              fontSize: 75,
              fontWeight: 900,
              marginBottom: 20,
              textAlign: 'center',
              lineHeight: 1.1,
              color: 'transparent',
              textShadow: '0 0 40px rgba(255,215,0,0.5), 0 4px 0px rgba(0,0,0,0.5)',
              backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #FFD700 100%)',
              backgroundClip: 'text',
            }}>
              {name}
            </div>

             {/* Subtitle */}
             <div style={{ fontSize: 28, color: '#9ca3af', marginBottom: 40, letterSpacing: '1px' }}>
              has been selected as the winner!
            </div>

            {/* Footer / Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 30, width: '100%', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <div style={{ fontSize: 24, color: '#FFD700', fontWeight: 'bold', letterSpacing: '2px' }}>
                SORTEO PRO
              </div>
              <div style={{ width: 1, height: 20, backgroundColor: '#444', margin: '0 10px' }}></div>
              <div style={{ fontSize: 20, color: '#666' }}>
                {dateStr}
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 30, color: '#444', fontSize: 18, letterSpacing: '4px', textTransform: 'uppercase' }}>
            Verify at sorteopro.com
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
