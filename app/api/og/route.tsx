import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has('name');
    const title = hasTitle
      ? searchParams.get('name')?.slice(0, 100)
      : 'Sorteo Pro Winner';

    // Basic date validation
    const dateParam = searchParams.get('date');
    const date = dateParam || new Date().toISOString().split('T')[0];

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
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #FFD70020 0%, transparent 70%)',
            color: 'white',
            border: '20px solid #FFD700',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            color: '#FFD700',
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 20,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex'
          }}>
            Winner Verified
          </div>

          {/* Winner Name */}
          <div style={{
            fontSize: 70,
            fontWeight: 'bold',
            marginBottom: 30,
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.1,
            color: 'white',
            display: 'flex',
            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          }}>
             {title}
          </div>

          {/* Footer Info */}
          <div style={{
             fontSize: 30,
             color: '#aaaaaa',
             marginTop: 10,
             display: 'flex'
          }}>
            {date}
          </div>

          {/* Branding */}
          <div style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 24,
            color: '#FFD700',
            opacity: 0.8,
            display: 'flex'
          }}>
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
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
