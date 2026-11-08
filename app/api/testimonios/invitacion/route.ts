import { NextResponse } from 'next/server';
import { validInvite } from '@/lib/testimonios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Dice si un código de invitación es válido (sin revelar cuál es el correcto). */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('c');
  return NextResponse.json({ valid: validInvite(code) }, { headers: { 'Cache-Control': 'no-store' } });
}
