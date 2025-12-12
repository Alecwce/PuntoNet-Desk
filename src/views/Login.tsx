import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/Icon";
import api from "@/lib/api";
import { AxiosError } from "axios";

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP input when 2FA view is shown
  useEffect(() => {
    if (requires2FA && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [requires2FA]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });

      // Check if 2FA is required
      if (response.data.require2fa) {
        setRequires2FA(true);
        setTempToken(response.data.tempToken);
        setUserId(response.data.userId);
        return;
      }

      // No 2FA - proceed with login
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Error al iniciar sesión. Verifique sus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Only keep last digit
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    // Focus last filled input or next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = otpDigits.join("");
    if (token.length !== 6) {
      setError("Por favor ingresa el código de 6 dígitos");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/auth/2fa/validate-login",
        { userId, token },
        { headers: { "x-2fa-token": tempToken } }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("2FA error:", error);
      setError(
        error.response?.data?.message || "Código incorrecto. Intenta de nuevo."
      );
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setRequires2FA(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setError(null);
    setTempToken("");
    setUserId("");
  };

  // 2FA Verification View
  if (requires2FA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Glass card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Icon name="shield" className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">PuntoNet</span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Verificación de Código
              </h1>
              <p className="text-gray-300 text-sm">
                Ingresa el código de 6 dígitos de tu aplicación autenticadora
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handle2FASubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold text-white bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-gray-500"
                    placeholder="•"
                  />
                ))}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    Confirmar Acceso
                    <Icon name="lock_open" className="text-lg" />
                  </>
                )}
              </button>

              {/* Back to login */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-2 text-gray-300 hover:text-white text-sm transition-colors"
              >
                ← Volver al inicio de sesión
              </button>
            </form>

            {/* Help text */}
            <p className="mt-6 text-center text-xs text-gray-400">
              ¿Problemas para acceder?{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Contactar soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Login View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        {/* Floating security illustration */}
        <div className="relative mb-8">
          <div className="w-72 h-48 lg:w-96 lg:h-64 relative">
            {/* Abstract security shapes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Main shield */}
                <div className="w-32 h-40 bg-gradient-to-b from-blue-400/30 to-cyan-400/30 backdrop-blur-sm rounded-t-full rounded-b-3xl border border-white/20 flex items-center justify-center">
                  <Icon name="security" className="text-6xl text-white/80" />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -left-8 w-12 h-12 bg-blue-500/40 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center animate-bounce">
                  <Icon name="lock" className="text-white text-lg" />
                </div>
                <div className="absolute -top-2 -right-10 w-10 h-10 bg-cyan-500/40 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center animate-bounce delay-300">
                  <Icon name="key" className="text-white text-sm" />
                </div>
                <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-indigo-500/40 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center animate-bounce delay-500">
                  <Icon name="verified_user" className="text-white text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/logo1.png"
            alt="PuntoNet"
            className="h-16 w-auto drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white text-center mb-4">
          Tu seguridad,
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            nuestra prioridad
          </span>
        </h1>
        <p className="text-gray-300 text-center max-w-md">
          Plataforma de gestión de tickets y soporte técnico con estándares de
          seguridad empresarial.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative z-10">
        {/* Glass card */}
        <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Card header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Icon name="support_agent" className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold text-white">PuntoNet</span>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">
            Acceso a PuntoNet
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Service Desk v2.5 (Fully Loaded)
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Correo Corporativo
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@puntonet.com"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <Icon
                  name="email"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} />
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-400 focus:ring-offset-0 bg-transparent"
                />
                Recordarme
              </label>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Entrar
                  <Icon name="arrow_forward" className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-2">
            <Icon name="warning" className="text-yellow-400 text-lg mt-0.5" />
            <p className="text-yellow-200/80 text-xs">
              Acceso restringido a personal autorizado de PuntoNet. Todas las
              acciones son monitoreadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
