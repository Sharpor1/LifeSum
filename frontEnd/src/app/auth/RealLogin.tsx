import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function RealLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa correo y contraseña"); return; }
    setError("");
    setBusy(true);
    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { email, password, username: email.split("@")[0], authType: "real" }
        : { email, password };
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Error"); return; }
      login(d.token, d.user);
      navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1520 50%, #0a0a1a 100%)" }}>
      <div className="relative w-full max-w-md px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/5 rounded-3xl blur-3xl" />

        <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-3xl font-bold text-white tracking-tight">LifeSum Admin</h1>
            <p className="text-white/40 text-sm mt-1">Inicio de sesión persistente</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Correo electrónico" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-colors text-sm" />
            <input type="password" placeholder="Contraseña" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-colors text-sm" />
            <button type="submit" disabled={busy}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold transition-all cursor-pointer">
              {busy ? "Procesando..." : isRegister ? "Crear cuenta permanente" : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300/80 text-xs leading-relaxed text-center">
            🛡️ Esta cuenta <strong>no se borra</strong>. Uso exclusivo para el administrador de la aplicación.
            Las cuentas aquí creadas son permanentes.
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => setIsRegister(!isRegister)}
              className="text-white/30 hover:text-white/60 text-xs underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none">
              {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate aquí"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <a href="/"
              className="text-white/20 hover:text-white/40 text-xs underline underline-offset-2 transition-colors">
              ← Volver a la página principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
