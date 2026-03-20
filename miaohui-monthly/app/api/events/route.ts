import { NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_DEPLOY_URL || '';
const API_KEY = process.env.GAS_API_KEY || '';

export async function GET() {
  if (!GAS_URL || !API_KEY) {
    return NextResponse.json({ success: false, error: 'env not set' });
  }

  try {
    const url = GAS_URL + '?action=getEvents&key=' + API_KEY;
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[route] GAS fetch failed:', err);
    return NextResponse.json({ success: false, error: 'fetch failed' });
  }
}