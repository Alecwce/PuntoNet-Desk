import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { ExportTicketsModal } from '../components/ExportTicketsModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect: (id: string) => void;
  onCreateTicket: (data: { subject: string; priority: string; description: string }) => void;
  onEditTicket: (id: string, data: { subject: string; priority: string; description: string }) => void;
  onDeleteTicket: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onTicketSelect, 
  onCreateTicket,
  onEditTicket,
  onDeleteTicket
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeMenuTicketId, setActiveMenuTicketId] = useState<string | null>(null);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
  const [ticketToDeleteId, setTicketToDeleteId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuTicketId && !(event.target as Element).closest('.action-menu-trigger')) {
        setActiveMenuTicketId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuTicketId]);
  
  const getStatusSegments = (status: string) => {
      // 0: Open, 1: Progress, 2: Resolved, 3: Closed
      const stages = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];
      const currentIndex = stages.indexOf(status);
      
      return (
          <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full flex overflow-hidden h-6 text-[10px] font-medium leading-none cursor-pointer relative group">
              {stages.map((stage, idx) => (
                  <div 
                    key={stage}
                    className={`flex-1 flex items-center justify-center transition-all duration-300 ${
                        idx <= currentIndex ? 'bg-primary text-white' : 'text-transparent group-hover:text-gray-500'
                    } border-r border-white/20 last:border-0 hover:bg-primary/80`}
                    title={stage}
                  >
                      <span className={`${idx === currentIndex ? 'block' : 'hidden group-hover:block'} truncate px-1`}>
                          {stage}
                      </span>
                  </div>
              ))}
          </div>
      )
  }

  const handleCreateTicket = (data: { subject: string; priority: string; description: string }) => {
    onCreateTicket(data);
  };

  const handleEditClick = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation(); // Prevent row click
    setTicketToEdit(ticket);
    setIsModalOpen(true);
    setActiveMenuTicketId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click
    setTicketToDeleteId(id);
    setIsDeleteModalOpen(true);
    setActiveMenuTicketId(null);
  };

  const confirmDelete = () => {
    if (ticketToDeleteId) {
      onDeleteTicket(ticketToDeleteId);
      setIsDeleteModalOpen(false);
      setTicketToDeleteId(null);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuTicketId(activeMenuTicketId === id ? null : id);
  };

  const handleOpenCreateModal = () => {
    setTicketToEdit(null); // Ensure we are in create mode
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="flex flex-col min-w-40 !h-10 max-w-sm w-full">
            <div className="flex w-full flex-1 items-stretch rounded-DEFAULT h-full shadow-sm">
              <div className="text-gray-500 flex border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pl-3 rounded-l-DEFAULT border-r-0">
                <Icon name="search" />
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" 
                placeholder="Buscar por ID, asunto, cliente..." 
              />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-DEFAULT bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors text-gray-700 dark:text-gray-200"
          >
            <Icon name="ios_share" className="text-gray-600 dark:text-gray-300" />
            <p className="text-sm font-medium leading-normal">Exportar</p>
          </button>
          <button 
            onClick={handleOpenCreateModal}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-DEFAULT bg-primary px-4 text-white hover:bg-primary/90 shadow-sm transition-colors"
          >
            <Icon name="add" />
            <p className="text-sm font-medium leading-normal">Nuevo Ticket</p>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium whitespace-nowrap">Filtros:</p>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-DEFAULT bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
            <p className="text-xs font-medium leading-normal">Estado</p>
            <Icon name="expand_more" className="text-sm text-gray-500" />
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-DEFAULT bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
            <p className="text-xs font-medium leading-normal">Prioridad</p>
            <Icon name="expand_more" className="text-sm text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
           <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">2 seleccionados</span>
           <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
           <button className="p-2 text-gray-500 hover:text-primary transition-colors" title="Asignar">
             <Icon name="person_add" />
           </button>
           <button className="p-2 text-gray-500 hover:text-primary transition-colors" title="Cambiar Estado">
             <Icon name="task_alt" />
           </button>
           <button className="p-2 text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
             <Icon name="delete" />
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm relative">
         <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                <th className="px-4 py-3 text-left w-12"><input className="h-4 w-4 rounded border-gray-300 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/></th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">ID Ticket</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Asunto</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Prioridad</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Asignado a</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Última Act.</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 w-12"><input className="h-4 w-4 rounded border-gray-300 bg-transparent text-primary focus:ring-primary/50" type="checkbox"/></td>
                    <td 
                        className="px-4 py-3 text-primary text-sm font-medium cursor-pointer hover:underline"
                        onClick={() => onTicketSelect(ticket.id)}
                    >
                        #{ticket.id.replace('TK-', '')}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 text-sm font-bold cursor-pointer" onClick={() => onTicketSelect(ticket.id)}>{ticket.subject}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{ticket.client}</td>
                    <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${ticket.priority === 'Alta' || ticket.priority === 'Crítica' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 
                            ticket.priority === 'Media' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'}`}>
                            {ticket.priority}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        {getStatusSegments(ticket.status)}
                    </td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                             <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6 border border-gray-200" style={{ backgroundImage: `url("${ticket.assignee.avatar}")` }}></div>
                             <span className="text-sm text-gray-700 dark:text-gray-200">{ticket.assignee.name}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{ticket.lastUpdate}</td>
                    <td className="px-4 py-3 relative">
                        <button 
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-white action-menu-trigger p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => toggleMenu(e, ticket.id)}
                        >
                            <Icon name="more_vert" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeMenuTicketId === ticket.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <div className="py-1">
                                    <button 
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                                        onClick={(e) => handleEditClick(e, ticket)}
                                    >
                                        <Icon name="edit" className="text-gray-500 text-base" />
                                        Editar
                                    </button>
                                    <button 
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                                        onClick={(e) => handleDeleteClick(e, ticket.id)}
                                    >
                                        <Icon name="delete" className="text-base" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
         </div>
      </div>
      
      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateTicket}
        onEdit={onEditTicket}
        ticketToEdit={ticketToEdit}
      />

      <ExportTicketsModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};