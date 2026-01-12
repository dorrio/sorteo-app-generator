import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fallbackUrl = new URL('/og-verify.jpg', url.origin).toString();

  // Return a 302 Redirect to the static image
  return NextResponse.redirect(fallbackUrl, 302);
}
