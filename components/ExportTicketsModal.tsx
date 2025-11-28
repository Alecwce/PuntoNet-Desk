import React, { useState } from 'react';
import { Icon } from './Icon';

interface ExportTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTicketsModal: React.FC<ExportTicketsModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('current');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
    console.log(`Exportando en formato ${format}, alcance: ${scope}, headers: ${includeHeaders}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                 <Icon name="ios_share" className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">
                Exportar Tickets
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            
            {/* Format Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Formato de Archivo
              </label>
              <div className="flex items-center gap-6">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      value="csv" 
                      checked={format === 'csv'} 
                      onChange={() => setFormat('csv')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">CSV</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      value="pdf" 
                      checked={format === 'pdf'} 
                      onChange={() => setFormat('pdf')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">PDF</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="format" 
                      value="excel" 
                      checked={format === 'excel'} 
                      onChange={() => setFormat('excel')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Excel (.xlsx)</span>
                 </label>
              </div>
            </div>

            {/* Scope Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alcance de los Datos
              </label>
              <div className="space-y-3">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="scope" 
                      value="current" 
                      checked={scope === 'current'} 
                      onChange={() => setScope('current')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Vista actual</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="scope" 
                      value="all" 
                      checked={scope === 'all'} 
                      onChange={() => setScope('all')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Todos los tickets</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="scope" 
                      value="selected" 
                      checked={scope === 'selected'} 
                      onChange={() => setScope('selected')}
                      className="text-primary focus:ring-primary h-4 w-4 border-gray-300" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Tickets seleccionados</span>
                 </label>
              </div>
            </div>

            {/* Columns Section (Mocked) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar columnas
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                  {['ID Ticket', 'Asunto', 'Cliente', 'Estado', 'Prioridad', 'Asignado a', 'Fecha Creación', 'Última Actualización'].map(col => (
                      <div key={col} className="flex items-center gap-2 py-1">
                          <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-gray-300" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{col}</span>
                      </div>
                  ))}
              </div>
            </div>

             {/* Options */}
             <div className="flex items-center gap-2">
                <div 
                    className={`flex items-center justify-center w-5 h-5 rounded-full cursor-pointer transition-colors ${includeHeaders ? 'bg-primary text-white' : 'border border-gray-300 bg-white'}`}
                    onClick={() => setIncludeHeaders(!includeHeaders)}
                >
                    {includeHeaders && <Icon name="check" className="text-xs font-bold" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => setIncludeHeaders(!includeHeaders)}>
                    Incluir encabezados de columna
                </span>
             </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
            <button
              onClick={handleExport}
              className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Exportar
            </button>
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};