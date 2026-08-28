import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setError("Escribe tu nombre para continuar"); return; }
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Error al iniciar sesión"); return; }
      login(d.token, d.user);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0d0b1e 0%, #1a0533 50%, #0d0b1e 100%)" }}>
      <div className="relative w-full max-w-md px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 rounded-3xl blur-3xl" />

        <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📅</div>
            <h1 className="text-3xl font-bold text-white tracking-tight">LifeSum</h1>
            <p className="text-white/40 text-sm mt-1">Gestor de actividades y proyectos</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Tu nombre" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors text-sm" />
            <button type="submit" disabled={busy}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all cursor-pointer">
              {busy ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-white/70 text-xs leading-relaxed text-center">
            Tu progreso queda guardado en esta sesión. Si cierras la página, se
            elimina automáticamente a los 3 minutos.
          </div>
        </div>
      </div>
    </div>
  );
}
