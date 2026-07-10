import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  async function handleGoogle() {
    setError("");
    setBusy("google");
    try {
      const r = await fetch("/api/auth/google", { method: "POST" });
      const d = await r.json();
      login(d.token, d.user);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy("");
    }
  }

  async function handleDemo() {
    setError("");
    setBusy("demo");
    try {
      const r = await fetch("/api/auth/demo", { method: "POST" });
      const d = await r.json();
      login(d.token, d.user);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy("");
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa correo y contraseña"); return; }
    setError("");
    setBusy("email");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Error al iniciar sesión"); return; }
      login(d.token, d.user);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy("");
    }
  }

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa correo y contraseña"); return; }
    setError("");
    setBusy("register");
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username: email.split("@")[0], authType: "email" }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Error al registrarse"); return; }
      login(d.token, d.user);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy("");
    }
  }

  const isBusy = (t: string) => busy === t ? "opacity-50 pointer-events-none" : "";

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

          <div className="space-y-3">
            <button onClick={handleGoogle} disabled={!!busy}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all cursor-pointer ${isBusy("google")}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {busy === "google" ? "Conectando..." : "Crear cuenta con Google"}
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">o</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button onClick={handleDemo} disabled={!!busy}
              className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all cursor-pointer ${isBusy("demo")}`}>
              {busy === "demo" ? "Cargando..." : "🚀 Acceso Demo — Probar sin registro"}
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">o</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input type="email" placeholder="Correo electrónico" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors text-sm" />
              <input type="password" placeholder="Contraseña" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors text-sm" />
              <div className="flex gap-2">
                <button type="submit" disabled={!!busy}
                  className={`flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all cursor-pointer text-sm ${isBusy("email")}`}>
                  {busy === "email" ? "Entrando..." : "Iniciar sesión"}
                </button>
                <button type="button" onClick={handleEmailRegister} disabled={!!busy}
                  className={`flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium transition-all cursor-pointer text-sm border border-white/10 ${isBusy("register")}`}>
                  {busy === "register" ? "Creando..." : "Crear cuenta"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/80 text-xs leading-relaxed text-center">
            ⚠️ Las cuentas creadas con Google o correo en esta página se eliminan automáticamente después de 1 hora.
            Son solo para pruebas de la aplicación.
          </div>

          <div className="mt-4 text-center">
            <a href="/real-login"
              className="text-white/30 hover:text-white/60 text-xs underline underline-offset-2 transition-colors">
              ¿Eres el administrador? Inicia sesión real aquí →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
