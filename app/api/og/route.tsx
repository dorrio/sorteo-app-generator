import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Params
    const type = searchParams.get('type'); // 'wheel' | 'list' | 'rng' | 'instagram' | undefined
    const name = searchParams.get('name')?.slice(0, 50);
    const dateParam = searchParams.get('date');
    const customTitle = searchParams.get('title')?.slice(0, 60);
    const customColor = searchParams.get('color');

    // --- THEME CONFIGURATION ---
    // Default: Golden Ticket (Generic)
    let theme = {
        title: "Sorteo Pro",
        subtitle: "The Ultimate Giveaway Tool",
        bgGradient: "radial-gradient(circle at 50% 0%, #423506 0%, #09090b 70%)", // Gold/Dark
        accentColor: "#FFD700", // Gold
        textColor: "white",
        subTextColor: "#a1a1aa", // zinc-400
        icon: (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
             </svg>
        ),
        largeIcon: null as any
    };

    if (type === 'wheel') {
        theme = {
            title: "Wheel of Names",
            subtitle: "Spin the Wheel • Pick a Winner",
            bgGradient: "radial-gradient(circle at center, #2e1065 0%, #000000 100%)", // Purple/Black
            accentColor: "#a855f7", // Purple 500
            textColor: "white",
            subTextColor: "#d8b4fe", // Purple 200
            icon: (
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2v10l5.4 5.4"/>
                    <circle cx="12" cy="12" r="2" fill="#a855f7" fillOpacity="0.5"/>
                 </svg>
            ),
            largeIcon: (
                 <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2v10l5.4 5.4"/>
                    <circle cx="12" cy="12" r="2" fill="#a855f7" fillOpacity="0.5"/>
                 </svg>
            )
        };
    } else if (type === 'instagram') {
        theme = {
            title: "Instagram Comment Picker",
            subtitle: "Free & Unlimited • No Login",
            bgGradient: "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)", // Insta Gradient
            accentColor: "#FFFFFF",
            textColor: "white",
            subTextColor: "rgba(255,255,255,0.9)",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
            ),
            largeIcon: (
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
            )
        };
    } else if (type === 'rng') {
        theme = {
            title: "Random Number Generator",
            subtitle: "Secure • Fair • Instant",
            bgGradient: "radial-gradient(circle at center, #064e3b 0%, #022c22 100%)", // Emerald/Dark
            accentColor: "#34d399", // Emerald 400
            textColor: "white",
            subTextColor: "#6ee7b7", // Emerald 300
            icon: (
                <div style={{ display: 'flex', gap: '2px', fontSize: 20, fontWeight: 900, color: "#34d399", fontFamily: 'monospace' }}>
                    <span>7</span>
                </div>
            ),
            largeIcon: (
                <div style={{ display: 'flex', gap: '20px', fontSize: 120, fontWeight: 900, color: "#34d399", fontFamily: 'monospace' }}>
                    <span>7</span><span>7</span><span>7</span>
                </div>
            )
        };
    } else if (type === 'list') {
        theme = {
            title: "List Randomizer",
            subtitle: "Shuffle Lists • Team Generator",
            bgGradient: "radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)", // Blue/Dark
            accentColor: "#60a5fa", // Blue 400
            textColor: "white",
            subTextColor: "#93c5fd", // Blue 300
            icon: (
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" x2="3" y1="6" y2="6"/>
                    <line x1="21" x2="9" y1="12" y2="12"/>
                    <line x1="21" x2="7" y1="18" y2="18"/>
                </svg>
            ),
            largeIcon: (
                 <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" x2="3" y1="6" y2="6"/>
                    <line x1="21" x2="9" y1="12" y2="12"/>
                    <line x1="21" x2="7" y1="18" y2="18"/>
                    <line x1="3" x2="3.01" y1="12" y2="12"/>
                    <line x1="3" x2="3.01" y1="18" y2="18"/>
                </svg>
            )
        };
    } else if (type === 'yes-no') {
        theme = {
            title: "Yes or No Wheel",
            subtitle: "Spin for Answer • 50/50 Chance",
            bgGradient: "radial-gradient(circle at center, #172554 0%, #020617 100%)", // Blue Dark
            accentColor: "#60a5fa", // Blue 400
            textColor: "white",
            subTextColor: "#93c5fd", // Blue 300
            icon: (
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                </svg>
            ),
            largeIcon: (
                 <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                </svg>
            )
        };
    } else if (type === 'letter') {
        theme = {
            title: "Random Letter Generator",
            subtitle: "A-Z Random Picker • Alphabet Wheel",
            bgGradient: "radial-gradient(circle at center, #be123c 0%, #4c0519 100%)", // Rose/Dark
            accentColor: "#fb7185", // Rose 400
            textColor: "white",
            subTextColor: "#fda4af", // Rose 300
            icon: (
                 <div style={{ display: 'flex', gap: '2px', fontSize: 20, fontWeight: 900, color: "#fb7185", fontFamily: 'serif' }}>
                    <span>A</span>
                </div>
            ),
            largeIcon: (
                 <div style={{ display: 'flex', gap: '5px', fontSize: 100, fontWeight: 900, color: "#fb7185", fontFamily: 'serif' }}>
                    <span>A</span><span style={{opacity:0.5}}>B</span><span style={{opacity:0.25}}>C</span>
                </div>
            )
        };
    }

    // VIRALIS: Apply custom color override if present
    if (customColor) {
        theme.accentColor = customColor;
        // Generate a lighter version for subtext (simple approach)
        theme.subTextColor = customColor + "CC"; // 80% opacity hex

        // Update gradient if it's not the Instagram gradient
        if (type !== 'instagram') {
             // Dark gradient with custom color hint
             theme.bgGradient = `radial-gradient(circle at center, ${customColor}40 0%, #000000 100%)`;
        }
    }

    // --- MODE SELECTION ---

    // MODE 1: VERIFICATION (Name is present)
    if (name) {
        const winnerName = name;
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
                    backgroundImage: theme.bgGradient,
                    backgroundColor: '#09090b',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    color: theme.textColor,
                }}
                >
                    {/* Corner Decorations */}
                    <div style={{ display: 'flex', position: 'absolute', top: 30, left: 30, width: 20, height: 20, borderTop: `2px solid ${theme.subTextColor}`, borderLeft: `2px solid ${theme.subTextColor}`, opacity: 0.5 }} />
                    <div style={{ display: 'flex', position: 'absolute', top: 30, right: 30, width: 20, height: 20, borderTop: `2px solid ${theme.subTextColor}`, borderRight: `2px solid ${theme.subTextColor}`, opacity: 0.5 }} />
                    <div style={{ display: 'flex', position: 'absolute', bottom: 30, left: 30, width: 20, height: 20, borderBottom: `2px solid ${theme.subTextColor}`, borderLeft: `2px solid ${theme.subTextColor}`, opacity: 0.5 }} />
                    <div style={{ display: 'flex', position: 'absolute', bottom: 30, right: 30, width: 20, height: 20, borderBottom: `2px solid ${theme.subTextColor}`, borderRight: `2px solid ${theme.subTextColor}`, opacity: 0.5 }} />

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
                            backgroundColor: `${theme.accentColor}26`, // 15% opacity
                            border: `1px solid ${theme.accentColor}4D`, // 30% opacity
                            borderRadius: '100px',
                            marginBottom: '30px',
                        }}>
                            {theme.icon}
                            <span style={{
                                color: theme.accentColor,
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                            }}>Official Verified Result</span>
                        </div>

                        {/* Viral Context: Custom Giveaway Title */}
                        {customTitle && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: 24,
                                fontWeight: 600,
                                color: theme.subTextColor,
                                marginBottom: 10,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '3px',
                                maxWidth: '900px',
                            }}>
                                {customTitle}
                            </div>
                        )}

                        {/* The Winner Name */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}>
                            <span style={{
                                color: theme.textColor,
                                fontSize: winnerName.length > 20 ? 60 : winnerName.length > 10 ? 90 : 120,
                                fontWeight: 900,
                                lineHeight: 1.1,
                                padding: '0 20px',
                                textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            }}>
                                {winnerName}
                            </span>
                        </div>

                        {/* Subtext */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: 24,
                            color: theme.subTextColor,
                            letterSpacing: '1px',
                            marginBottom: '40px',
                            textAlign: 'center',
                        }}>
                            has been randomly selected as the winner
                        </div>

                        {/* Footer Bar */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: `1px solid ${theme.subTextColor}33`, // 20% opacity
                            width: '600px',
                        }}>
                             {/* Viral CTA - The Loop */}
                             <div style={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 fontSize: 22,
                                 color: theme.textColor,
                                 fontWeight: 600,
                                 marginBottom: '15px',
                                 letterSpacing: '0.5px',
                             }}>
                                Create Your Own Giveaway at SorteoPro.com
                             </div>

                             <div style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '20px',
                                 justifyContent: 'center',
                             }}>
                                {/* Brand */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: 20, color: theme.accentColor, fontWeight: 'bold', letterSpacing: '1px' }}>{theme.title.toUpperCase()}</span>
                                </div>

                                <div style={{ display: 'flex', width: 1, height: 20, backgroundColor: theme.subTextColor }} />

                                {/* Date Stamp */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: 18, color: theme.subTextColor, fontFamily: 'monospace' }}>{dateStr}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* "Stamp" Effect Overlay */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
            { width: 1200, height: 630 }
        );
    }

    // MODE 2: TOOL PROMO (No Name)
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
            backgroundImage: theme.bgGradient,
            fontFamily: 'sans-serif',
            position: 'relative',
            color: 'white',
          }}
        >
             {/* Overlay for readability if needed */}
             <div style={{ display: 'flex', position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

             <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40, filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}>
                    {theme.largeIcon || theme.icon}
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 80,
                    fontWeight: 900,
                    margin: 0,
                    marginBottom: 20,
                    textAlign: 'center',
                    lineHeight: 1.1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    background: type === 'instagram' ? 'white' : `linear-gradient(to bottom, white, ${theme.accentColor})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                }}>
                    {customTitle || theme.title}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 40,
                    margin: 0,
                    color: theme.subTextColor,
                    fontWeight: 500,
                    letterSpacing: '1px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}>
                    {theme.subtitle}
                </p>
             </div>

             {/* Brand Logo Bottom Center */}
             <div style={{
                 position: 'absolute',
                 bottom: 50,
                 display: 'flex',
                 alignItems: 'center',
                 gap: 12,
                 zIndex: 10
             }}>
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                 </svg>
                 <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '2px' }}>SORTEO PRO</span>
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
