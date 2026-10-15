// Serverless function served at /api/health — used to confirm the backend is deployed.
export function GET() {
  return Response.json({ status: "ok", time: new Date().toISOString() });
}
