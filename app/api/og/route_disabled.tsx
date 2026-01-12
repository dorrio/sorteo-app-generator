import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?name=<name>&date=<date>
    const name = searchParams.get('name')?.slice(0, 50) || 'Verified Winner';
    const dateParam = searchParams.get('date');

    let dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (dateParam) {
        const d = new Date(dateParam);
        if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
            backgroundColor: '#09090b', // zinc-950
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
             {/* Gradient Background Layer */}
             <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'radial-gradient(circle at 50% 0%, #423506 0%, #09090b 70%)',
             }} />

            {/* Corner Decorations */}
            <div style={{ position: 'absolute', top: 30, left: 30, width: 20, height: 20, borderTop: '2px solid #666', borderLeft: '2px solid #666' }} />
            <div style={{ position: 'absolute', top: 30, right: 30, width: 20, height: 20, borderTop: '2px solid #666', borderRight: '2px solid #666' }} />
            <div style={{ position: 'absolute', bottom: 30, left: 30, width: 20, height: 20, borderBottom: '2px solid #666', borderLeft: '2px solid #666' }} />
            <div style={{ position: 'absolute', bottom: 30, right: 30, width: 20, height: 20, borderBottom: '2px solid #666', borderRight: '2px solid #666' }} />

            {/* Main Content Container */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
            }}>
                {/* Verified Badge Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 20px',
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '100px',
                    marginBottom: '30px',
                }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span style={{
                        color: '#FFD700',
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}>Official Verified Result</span>
                </div>

                {/* The Winner Name */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '20px',
                    textAlign: 'center',
                }}>
                    <span style={{
                        color: 'white',
                        fontSize: name.length > 20 ? 60 : name.length > 10 ? 90 : 120,
                        fontWeight: 900,
                        lineHeight: 1.1,
                        padding: '0 20px',
                        textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    }}>
                        {name}
                    </span>
                </div>

                {/* Subtext */}
                <div style={{
                    fontSize: 24,
                    color: '#a1a1aa', // zinc-400
                    letterSpacing: '1px',
                    marginBottom: '40px',
                    textAlign: 'center',
                }}>
                    has been randomly selected as the winner
                </div>

                {/* Footer Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginTop: '20px',
                    paddingTop: '30px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '600px',
                    justifyContent: 'center',
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>
                        <span style={{ fontSize: 20, color: '#FFD700', fontWeight: 'bold', letterSpacing: '1px' }}>SORTEO PRO</span>
                    </div>

                    <div style={{ width: 1, height: 20, backgroundColor: '#333' }} />

                    {/* Date Stamp */}
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: 18, color: '#888', fontFamily: 'monospace' }}>{dateStr}</span>
                    </div>
                </div>
            </div>

            {/* "Stamp" Effect Overlay */}
            <div style={{
                position: 'absolute',
                right: 50,
                bottom: 50,
                border: '4px solid #22c55e', // Green stamp
                color: '#22c55e',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: 24,
                fontWeight: 900,
                textTransform: 'uppercase',
                transform: 'rotate(-15deg)',
                opacity: 0.8,
                letterSpacing: '2px',
            }}>
                VERIFIED
            </div>

        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error("OG Image Generation Failed:", e);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
