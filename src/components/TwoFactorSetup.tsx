import React, { useState, useRef } from "react";
import { Icon } from "./Icon";
import api from "@/lib/api";
import { AxiosError } from "axios";

interface TwoFactorSetupProps {
  isEnabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  isEnabled,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"generate" | "verify">("generate");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  const handleOpenSetup = async () => {
    setIsModalOpen(true);
    setStep("generate");
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/2fa/generate");
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Error al generar código QR");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otpDigits.join("");
    if (token.length !== 6) {
      setError("Por favor ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/2fa/verify", { token });
      onStatusChange(true);
      setIsModalOpen(false);
      setStep("generate");
      setOtpDigits(["", "", "", "", "", ""]);
      setQrCode("");
      setSecret("");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Código incorrecto");
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/2fa/disable");
      onStatusChange(false);
      setIsDisableModalOpen(false);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Error al desactivar 2FA");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep("generate");
    setOtpDigits(["", "", "", "", "", ""]);
    setQrCode("");
    setSecret("");
    setError(null);
  };

  return (
    <>
      {/* 2FA Status Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isEnabled
                ? "bg-green-500/20 text-green-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            <Icon
              name={isEnabled ? "verified_user" : "shield"}
              className="text-2xl"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Autenticación de Dos Factores (2FA)
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {isEnabled
                ? "Tu cuenta está protegida con autenticación de dos factores."
                : "Añade una capa extra de seguridad a tu cuenta usando una aplicación autenticadora."}
            </p>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  isEnabled
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEnabled ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></span>
                {isEnabled ? "Activo" : "Inactivo"}
              </span>

              {isEnabled ? (
                <button
                  onClick={() => setIsDisableModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Desactivar 2FA
                </button>
              ) : (
                <button
                  onClick={handleOpenSetup}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Activar 2FA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name="security" className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Configurar 2FA
                  </h3>
                  <p className="text-blue-100 text-xs">Seguridad adicional</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Icon name="close" className="text-2xl" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {loading && step === "generate" ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Generando código QR...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {step === "generate" && qrCode && (
                    <div className="space-y-6">
                      {/* Instructions */}
                      <div className="bg-slate-800 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                            1
                          </span>
                          Escanea el código QR
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Usa Google Authenticator, Microsoft Authenticator u
                          otra app compatible.
                        </p>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-2xl">
                          <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                      </div>

                      {/* Manual entry */}
                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-gray-400 text-xs mb-2">
                          ¿No puedes escanear? Ingresa este código manualmente:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-slate-700 px-3 py-2 rounded-lg text-cyan-400 font-mono text-sm break-all">
                            {secret}
                          </code>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(secret)
                            }
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Copiar"
                          >
                            <Icon name="content_copy" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setStep("verify");
                          setTimeout(
                            () => otpInputRefs.current[0]?.focus(),
                            100
                          );
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                      >
                        Ya lo escaneé, continuar →
                      </button>
                    </div>
                  )}

                  {step === "verify" && (
                    <div className="space-y-6">
                      <div className="bg-slate-800 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                            2
                          </span>
                          Ingresa el código de verificación
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Escribe el código de 6 dígitos que aparece en tu
                          aplicación.
                        </p>
                      </div>

                      {/* OTP Input */}
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
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-bold text-white bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep("generate")}
                          className="flex-1 py-3 border border-slate-600 text-gray-300 font-medium rounded-xl hover:bg-slate-800 transition-all"
                        >
                          ← Atrás
                        </button>
                        <button
                          onClick={handleVerify}
                          disabled={loading}
                          className={`flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Activando..." : "Activar 2FA"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirmation Modal */}
      {isDisableModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Icon name="warning" className="text-red-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  ¿Desactivar 2FA?
                </h3>
                <p className="text-gray-400 text-sm">
                  Esta acción reducirá la seguridad
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6">
              Tu cuenta quedará protegida solo con contraseña. Te recomendamos
              mantener 2FA activo para mayor seguridad.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDisableModalOpen(false);
                  setError(null);
                }}
                className="flex-1 py-3 border border-slate-600 text-gray-300 font-medium rounded-xl hover:bg-slate-800 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisable}
                disabled={loading}
                className={`flex-1 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Desactivando..." : "Desactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
