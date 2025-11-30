import React, { useState } from "react";
import { Icon } from "../components/Icon";
import api from "../lib/api";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });

      // Store token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Proceed to next view
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col lg:flex-row">
      {/* Left Panel - Branding - REDISEÑADO Y CENTRADO - Ancho aumentado a 40% */}
      <div className="w-full lg:w-2/4 bg-brand-panel text-white p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* Contenedor centrado */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 max-w-md">
          {/* Imagen decorativa - Centrada y más grande */}
          <div className="mb-4">
            <img
              src="https://picsum.photos/400/250"
              alt="Security Illustration"
              className="rounded-2xl shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Logo y Branding - Centrado y más prominente */}
          <div className="flex flex-col items-center gap-4">
            {/* Icono circular */}
            <div className="bg-blue-500 p-4 rounded-full shadow-lg">
              <Icon
                name="support_agent"
                className="text-brand-panel-light text-4xl"
              />
            </div>

            {/* Texto del branding - Centrado */}
            <div className="text-center">
              <h2 className="text-4xl font-bold leading-tight mb-2 text-black">
                PuntoNet
              </h2>
              <p className="text-xl text-black font-semibold">Service Desk</p>
            </div>
          </div>

          {/* Descripción - Centrada y más legible */}
          <p className="text-black text-base leading-relaxed px-4">
            Comprometidos con la seguridad de su información. Acceso seguro para
            personal autorizado.
          </p>
        </div>
      </div>

      {/* Form Section - Ajustado a 60% para balance */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 relative">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <div className="bg-primary p-1.5 rounded-full flex items-center justify-center">
                  <Icon name="support_agent" className="text-white text-lg" />
                </div>
                <span className="text-2xl">PuntoNet</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Accede a tu cuenta de Service Desk
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Correo Corporativo
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                    placeholder="ej: usuario@puntonet.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                    placeholder="Su contraseña segura"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "visibility_off" : "visibility"}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-blue-800"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg flex items-start gap-2 text-yellow-800 text-xs">
              <Icon name="warning" className="text-yellow-600 text-base" />
              <span>Acceso restringido a personal autorizado de PuntoNet.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
