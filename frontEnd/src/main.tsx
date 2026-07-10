import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./app/auth/AuthContext.tsx";
import App from "./app/App.tsx";
import Login from "./app/auth/Login.tsx";
import RealLogin from "./app/auth/RealLogin.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/real-login" element={<RealLogin />} />
        <Route path="*" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);