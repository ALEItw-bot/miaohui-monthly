export async function GET() {
  const gasUrl = process.env.GAS_DEPLOY_URL;
  const apiKey = process.env.GAS_API_KEY;

  if (!gasUrl || !apiKey) {
    return Response.json({ success: false, error: 'Missing env vars' }, { status: 500 });
  }

  try {
    const res = await fetch(`${gasUrl}?action=getAnnouncements&key=${apiKey}`, {
      next: { revalidate: 300 }
    });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ success: false, error: String(err) }, { status: 500 });
  }
}