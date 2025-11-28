import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('usuario@puntonet.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Brand Panel */}
      <div className="hidden lg:flex w-1/3 flex-col items-center justify-center bg-brand-panel-light p-12 text-center text-white">
         {/* Placeholder illustration based on screenshot */}
        <div className="mb-8 opacity-90">
             <img src="https://picsum.photos/300/200" alt="Security Illustration" className="rounded-lg mix-blend-overlay opacity-50" />
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
          Comprometidos con la seguridad de su información. Acceso seguro para personal autorizado.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-8 md:p-12 relative">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                    <div className="bg-primary p-1.5 rounded-full flex items-center justify-center">
                        <Icon name="support_agent" className="text-white text-lg" />
                    </div>
                    PuntoNet Service Desk
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
               <Icon name="lock" className="text-yellow-600" fill /> Bienvenido de nuevo <Icon name="lock" className="text-gray-400" />
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo Corporativo
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm shadow-sm transition-colors"
                    placeholder="ej: usuario@puntonet.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm shadow-sm transition-colors"
                    placeholder="Su contraseña segura"
                  />
                   <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                   >
                    <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-gray-400 hover:text-gray-600" />
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
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition-all"
              >
                Iniciar Sesión
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