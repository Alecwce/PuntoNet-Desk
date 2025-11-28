import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Ticket } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { subject: string; priority: string; description: string }) => void;
  onEdit?: (id: string, data: { subject: string; priority: string; description: string }) => void;
  ticketToEdit?: Ticket | null;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  onEdit, 
  ticketToEdit 
}) => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('Baja');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});

  // Effect to populate fields when editing
  useEffect(() => {
    if (isOpen && ticketToEdit) {
      setSubject(ticketToEdit.subject);
      setPriority(ticketToEdit.priority);
      // Try to extract description from the first message
      const firstMsg = ticketToEdit.messages.find(m => m.isMe)?.text || '';
      setDescription(firstMsg);
    } else if (isOpen && !ticketToEdit) {
      // Reset if opening in create mode
      setSubject('');
      setPriority('Baja');
      setDescription('');
    }
    setErrors({});
  }, [isOpen, ticketToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { subject?: string; description?: string } = {};
    
    if (!subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (ticketToEdit && onEdit) {
      onEdit(ticketToEdit.id, { subject, priority, description });
    } else {
      onCreate({ subject, priority, description });
    }
    
    // Reset form and close
    setSubject('');
    setPriority('Baja');
    setDescription('');
    setErrors({});
    onClose();
  };

  const isEditMode = !!ticketToEdit;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                 <Icon name={isEditMode ? "edit" : "confirmation_number"} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">
                {isEditMode ? `Editar Ticket #${ticketToEdit?.id.replace('TK-', '')}` : 'Crear Nuevo Ticket'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              
              {/* Section 1 */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Identificación del Ticket</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      className={`form-input w-full rounded-lg border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary'} dark:bg-gray-900 dark:text-white sm:text-sm py-2.5`}
                      placeholder="Ej: Problema con la impresora"
                    />
                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prioridad
                    </label>
                    <div className="relative">
                        <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="form-select w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white sm:text-sm py-2.5 appearance-none"
                        >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Detalles del Incidente</h4>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) setErrors({ ...errors, description: undefined });
                    }}
                    maxLength={1000}
                    className={`form-textarea w-full rounded-lg border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary'} dark:bg-gray-900 dark:text-white sm:text-sm p-3 resize-none`}
                    placeholder="Por favor, describe el problema con la mayor cantidad de detalles posible..."
                  ></textarea>
                  <div className="flex justify-end mt-1">
                      <span className="text-xs text-gray-400">{description.length}/1000 caracteres</span>
                  </div>
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
              <button
                type="submit"
                className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              >
                {isEditMode ? 'Guardar Cambios' : 'Crear Ticket'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};