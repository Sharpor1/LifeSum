import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AuthUser {
  id: string;
  username: string;
  authType: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("lifesum_token");
    const savedUser = localStorage.getItem("lifesum_user");
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: savedToken }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.valid) {
              setToken(savedToken);
              setUser(data.user);
            } else {
              localStorage.removeItem("lifesum_token");
              localStorage.removeItem("lifesum_user");
            }
          })
          .catch(() => {
            setToken(savedToken);
            setUser(parsed);
          })
          .finally(() => setLoading(false));
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("lifesum_token", newToken);
    localStorage.setItem("lifesum_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("lifesum_token");
    localStorage.removeItem("lifesum_user");
    setToken(null);
    setUser(null);
  }, []);

  // Heartbeat: mientras la página está abierta renovamos la expiración de la
  // cuenta temporal. Si el cliente cierra/abandona la página, el backend la
  // borra pasados los GUEST_TIMEOUT_SECONDS de inactividad.
  useEffect(() => {
    if (!token) return;
    const beat = () => {
      fetch("/api/auth/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      }).catch(() => {});
    };
    beat();
    const id = setInterval(beat, 5000);
    return () => clearInterval(id);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
