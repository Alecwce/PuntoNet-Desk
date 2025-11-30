import React, { useState } from "react";
import { Icon } from "../components/Icon";

interface TwoFactorProps {
  onVerify: () => void;
}

export const TwoFactor: React.FC<TwoFactorProps> = ({ onVerify }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any code
    onVerify();
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Brand Panel (Identical to Login) */}
      <div className="hidden lg:flex w-1/3 flex-col items-center justify-center bg-brand-panel-light p-12 text-center text-white">
        <div className="mb-8 opacity-90 bg-amber-100 rounded-lg p-6 flex items-center justify-center">
          <Icon name="security" className="text-amber-800 text-6xl" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-full">
            <Icon name="support_agent" className="text-brand-panel-light" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold leading-none">PuntoNet</h2>
            <p className="text-sm text-gray-300 leading-none">Service Desk</p>
          </div>
        </div>
        <p className="text-gray-300 max-w-sm text-sm">
          Comprometidos con la seguridad de su información. Acceso seguro para
          personal autorizado.
        </p>
      </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-2 rounded-full flex items-center justify-center">
                <Icon name="support_agent" className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PuntoNet Service Desk
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Proteger tu Cuenta
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Para tu seguridad, necesitamos verificar tu identidad. Elige un
              método.
            </p>
          </div>

          <div className="space-y-4">
            <div className="cursor-pointer p-4 rounded-lg border-2 border-primary ring-2 ring-primary/20 bg-white dark:bg-gray-800 shadow-md transition-all relative">
              <div className="flex items-center">
                <Icon name="email" className="text-primary mr-4 text-2xl" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Enviar código al Email
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Se enviará un código a us***o@puntonet.com
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-primary">
                <Icon name="check_circle" fill />
              </div>
            </div>

            <div className="cursor-pointer p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all opacity-70 hover:opacity-100">
              <div className="flex items-center">
                <Icon
                  name="smartphone"
                  className="text-gray-500 dark:text-gray-400 mr-4 text-2xl"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Usar aplicación autenticadora
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Obtén un código de tu app móvil
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                Código de Verificación
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="- - - - - -"
                className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-xl text-center tracking-[0.5em] font-mono text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Verificar
              </button>
            </div>
          </form>

          <div className="text-center space-y-4">
            <a
              href="#"
              className="text-sm font-medium text-primary hover:underline"
            >
              ¿Necesitas ayuda?
            </a>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              En PuntoNet, la seguridad y privacidad de sus datos es nuestra
              máxima prioridad. Nunca compartiremos su información.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
