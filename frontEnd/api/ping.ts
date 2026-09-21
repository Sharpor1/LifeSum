// Función serverless de Vercel: despierta/mantiene vivo el backend de Render.
// Se dispara con el cron de vercel.json (y/o un monitor externo como UptimeRobot).
//
// IMPORTANTE: esta función debe responder SIEMPRE rápido. Render (plan gratis)
// tarda ~45-60s en arrancar tras estar dormido (cold start). Si esta función
// esperara a que Render responda, superaría el límite de la función serverless
// de Vercel y Vercel la mataría con un timeout. Por eso el ping se lanza "en
// background" y esta función devuelve 200 inmediatamente: el objetivo solo es
// forzar a Render a despertarse, no esperar a su respuesta.
export default async function handler() {
  // Disparar el cold start de Render sin bloquear esta función.
  const PING_URL = process.env.PING_URL ?? "https://lifesum.onrender.com/api/health";
  void fetch(PING_URL, { signal: AbortSignal.timeout(20000) }).catch(() => {});

  return new Response(
    JSON.stringify({ pinged: true, ts: Date.now() }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
