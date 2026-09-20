// Función serverless de Vercel: despierta el backend de Render.
// Se dispara con el cron definido en vercel.json (cada 5 minutos en plan Pro).
// En el plan gratuito de Vercel el cron solo corre 1 vez al día, por lo que
// para mantener despierto Render se recomienda además un monitor externo
// (UptimeRobot / cron-job.org) contra GET https://lifesum.onrender.com/api/health
export default async function handler() {
  try {
    const res = await fetch("https://lifesum.onrender.com/api/health", {
      signal: AbortSignal.timeout(15000),
    });
    return new Response(
      JSON.stringify({ pinged: true, status: res.status }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        pinged: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}