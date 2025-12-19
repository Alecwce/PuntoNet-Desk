import React, { useState, useEffect } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { Fragment } from "react";
import { Icon } from "./Icon";

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

const POLICY_TABS = [
  { id: "privacy", name: "Privacidad (Ley 29733)" },
  { id: "copyright", name: "Derechos de Autor (DL 822)" },
  { id: "security", name: "Seguridad y Protocolos" },
];

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasScrolled_privacy, setHasScrolled_privacy] = useState(false);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-2"
                  >
                    <Icon name="gavel" className="text-primary" />
                    Políticas y Términos Legales
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Icon name="close" className="text-xl" />
                  </button>
                </div>

                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 dark:bg-gray-700 p-1 mb-6">
                    {POLICY_TABS.map((tab) => (
                      <Tab
                        key={tab.id}
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                          ${
                            selected
                              ? "bg-white dark:bg-gray-600 text-primary shadow"
                              : "text-blue-700 dark:text-blue-100 hover:bg-white/[0.12] hover:text-blue-600"
                          }`
                        }
                      >
                        {tab.name}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-bold mb-4">
                          Política de Protección de Datos Personales (Ley N°
                          29733)
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          En cumplimiento de la <strong>Ley N° 29733</strong>,
                          Ley de Protección de Datos Personales, y su
                          Reglamento, <strong>PuntoNet S.A.</strong> garantiza
                          la confidencialidad, integridad y seguridad de los
                          datos personales proporcionados por nuestros usuarios.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <li>
                            <strong>Consentimiento:</strong> Al utilizar esta
                            plataforma, el usuario autoriza el tratamiento de
                            sus datos para fines de gestión de incidencias y
                            soporte técnico.
                          </li>
                          <li>
                            <strong>Finalidad:</strong> Los datos serán
                            utilizados exclusivamente para la identificación,
                            autenticación y seguimiento de solicitudes de
                            servicio.
                          </li>
                          <li>
                            <strong>Derechos ARCO:</strong> El titular puede
                            ejercer sus derechos de Acceso, Rectificación,
                            Cancelación y Oposición escribiendo a
                            privacidad@puntonet.com.
                          </li>
                          <li>
                            <strong>Seguridad:</strong> Implementamos cifrado
                            SSL/TLS y controles de acceso estrictos para
                            proteger la información.
                          </li>
                        </ul>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-bold mb-4">
                          Derechos de Autor y Propiedad Intelectual (DL 822)
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Conforme al <strong>Decreto Legislativo 822</strong>,
                          Ley sobre el Derecho de Autor:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <li>
                            <strong>Titularidad:</strong> Todo el software,
                            diseño, código fuente y contenido de "PuntoNet-Desk"
                            es propiedad exclusiva de PuntoNet S.A.
                          </li>
                          <li>
                            <strong>Base de Conocimiento:</strong> Los artículos
                            y manuales disponibles en la plataforma están
                            protegidos. Se prohíbe su reproducción total o
                            parcial con fines comerciales sin autorización
                            expresa.
                          </li>
                          <li>
                            <strong>Uso de Licencia:</strong> Se otorga al
                            usuario una licencia no exclusiva, intransferible y
                            revocable para el uso de la plataforma en el ámbito
                            laboral estrictamente.
                          </li>
                          <li>
                            <strong>Sanciones:</strong> El uso no autorizado o
                            la ingeniería inversa serán sancionados según la
                            legislación peruana vigente.
                          </li>
                        </ul>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-bold mb-4">
                          Políticas Internas y Protocolos de Seguridad
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                              🔒 Protocolo de Contraseñas
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              - Cambio obligatorio cada 90 días.
                              <br />
                              - Mínimo 8 caracteres, incluyendo mayúsculas,
                              números y símbolos.
                              <br />- Prohibido compartir credenciales.
                            </p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                              🛡️ Autenticación de Doble Factor (2FA)
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Es obligatorio para todos los usuarios con rol
                              ADMIN y AGENTE activar el 2FA para acceder a
                              información sensible.
                            </p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-300">
                              📁 Clasificación de la Información
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              - <strong>Pública:</strong> Base de Conocimiento
                              General.
                              <br />- <strong>Confidencial:</strong> Datos de
                              Tickets y Clientes.
                              <br />-{" "}
                              <strong>Estrictamente Confidencial:</strong>
                              Credenciales y Logs de Auditoría.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                  {onAccept && (
                    <button
                      onClick={onAccept}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm flex items-center gap-2"
                    >
                      <Icon name="check_circle" className="text-lg" />
                      Aceptar y Continuar
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
