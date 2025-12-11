import React, { useState } from "react";
import { Icon } from "../components/Icon";
import api from "../lib/api";

interface ResetPasswordProps {
  onSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get token from URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token no válido o faltante.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      onSuccess(); // Triggers login or success view
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al restablecer contraseña. El token puede haber expirado."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="error_outline" className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Enlace Inválido
          </h2>
          <p className="text-gray-500 mb-6">
            No se encontró el token de recuperación.
          </p>
          <button onClick={onSuccess} className="glass-button w-full">
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="text-center mb-8 mt-4 relative z-10">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="key" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nueva Contraseña
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Ingresa una contraseña segura.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lock" className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input pl-10 pr-10 w-full"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lock_clock" className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input pl-10 w-full"
                placeholder="Repite la contraseña"
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
              "Cambiar Contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
