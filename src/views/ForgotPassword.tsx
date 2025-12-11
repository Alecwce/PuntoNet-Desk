import React, { useState } from "react";
import { Icon } from "../components/Icon";
import api from "../lib/api";

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      // Even if error, we might want to show success for security,
      // but here we'll show generic error if it's a 500
      setError("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500"
        >
          <Icon name="arrow_back" />
        </button>

        <div className="text-center mb-8 mt-4 relative z-10">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lock_reset" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recuperar Contraseña
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Ingresa tu correo y te enviaremos instrucciones.
          </p>
        </div>

        {success ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Correo Enviado!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Revisa tu bandeja de entrada (y spam) para continuar.
            </p>
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-white rounded-xl font-medium transition-all"
            >
              Volver al Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="email" className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-10 w-full"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <Icon name="error" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Enviar Instrucciones"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
