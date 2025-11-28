import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Ticket } from '../types';

interface TicketDetailProps {
  ticketId: string;
  tickets: Ticket[]; // Receive tickets from parent
  onBack: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, tickets, onBack }) => {
  // Find ticket from props
  const ticket: Ticket | undefined = tickets.find(t => t.id === ticketId);
  const [activeTab, setActiveTab] = useState('activity');
  const [replyText, setReplyText] = useState('');

  if (!ticket) {
      return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-gray-500">Ticket no encontrado</p>
              <button onClick={onBack} className="text-primary hover:underline">Volver</button>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Detail Header */}
      <div className="p-8 pb-4 flex flex-col gap-6">
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 cursor-pointer hover:text-primary" onClick={onBack}>
             <Icon name="arrow_back" className="text-sm" /> Volver a la lista
         </div>
         
         <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
             <div className="flex items-center gap-4">
                 <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">{ticket.id}</span>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
             </div>
             <div className="flex items-center gap-3">
                 <button className="flex h-9 items-center justify-center gap-2 rounded-DEFAULT bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm transition-colors">
                     Asignar
                 </button>
                  <button className="flex h-9 items-center justify-center gap-2 rounded-DEFAULT bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm transition-colors">
                     Cerrar
                 </button>
                 <button className="flex items-center justify-center gap-2 h-9 px-4 bg-primary text-white text-sm font-medium rounded-DEFAULT hover:bg-primary/90 shadow-sm transition-colors">
                    Resolver
                 </button>
             </div>
         </div>

         <div className="flex flex-wrap items-center gap-6 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="flex items-center gap-2">
                 <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</label>
                 <div className="relative">
                     <select 
                        defaultValue={ticket.status}
                        className="form-select appearance-none pl-3 pr-8 py-1 rounded-DEFAULT border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium focus:border-primary focus:ring-primary/50 text-gray-800 dark:text-gray-100"
                     >
                         <option>Abierto</option>
                         <option>En Progreso</option>
                         <option>Resuelto</option>
                         <option>Cerrado</option>
                     </select>
                 </div>
             </div>
              <div className="flex items-center gap-2">
                 <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad:</label>
                 <div className="relative flex items-center">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium z-10 ml-1
                         ${ticket.priority === 'Alta' || ticket.priority === 'Crítica' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 
                         ticket.priority === 'Media' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200' :
                         'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'}`}>
                         {ticket.priority}
                     </span>
                     <select className="form-select appearance-none pl-16 pr-8 py-1 rounded-DEFAULT border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium focus:border-primary focus:ring-primary/50 opacity-0 absolute inset-0 w-full h-full cursor-pointer">
                         <option>Baja</option>
                         <option>Media</option>
                         <option>Alta</option>
                         <option>Crítica</option>
                     </select>
                     <Icon name="expand_more" className="text-gray-500 ml-2" />
                 </div>
             </div>
             <div className="flex items-center gap-2 ml-auto">
                 <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Asignado a:</label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                     <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6" style={{ backgroundImage: `url("${ticket.assignee.avatar}")` }}></div>
                     <span className="text-sm text-gray-700 dark:text-gray-200">{ticket.assignee.name}</span>
                  </div>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
             {['Detalles', 'Actividad/Chat', 'Adjuntos', 'Base de Conocimiento', 'Historial'].map((tab) => {
                 const id = tab.toLowerCase().includes('chat') ? 'activity' : tab.toLowerCase();
                 return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(id)}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                 )
             })}
          </nav>
      </div>

      {/* Tab Content (Activity focused) */}
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark scrollbar-hide">
         {activeTab === 'activity' ? (
             <div className="max-w-4xl mx-auto space-y-8 pb-24">
                 {/* Chat Messages */}
                 {ticket.messages.length > 0 ? ticket.messages.map((msg, idx) => (
                     <div key={msg.id} className="animate-fade-in-up">
                        <div className={`flex items-start gap-4 ${msg.isMe ? 'justify-end' : ''}`}>
                             {!msg.isMe && (
                                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border border-gray-200" style={{ backgroundImage: `url("${msg.avatar}")` }}></div>
                             )}
                             <div className={`flex flex-col gap-1 ${msg.isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.sender}</span>
                                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                </div>
                                <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                                    msg.isMe 
                                    ? 'rounded-tr-none bg-primary/10 dark:bg-primary/20 text-gray-800 dark:text-gray-100 border border-primary/20' 
                                    : 'rounded-tl-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                                }`}>
                                    {msg.text}
                                </div>
                             </div>
                              {msg.isMe && (
                                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border border-gray-200" style={{ backgroundImage: `url("${msg.avatar}")` }}></div>
                             )}
                        </div>
                     </div>
                 )) : (
                     <div className="text-center text-gray-500 py-10">No hay mensajes en este ticket.</div>
                 )}
             </div>
         ) : (
             <div className="text-center text-gray-500 mt-10">Contenido de la pestaña {activeTab} no implementado en esta demo.</div>
         )}
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shadow-lg">
          <div className="max-w-4xl mx-auto relative">
              <textarea 
                className="form-textarea w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:border-primary focus:ring-primary/30 text-sm p-4 pr-32 shadow-inner resize-none" 
                placeholder="Escribe un comentario o respuesta..." 
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                      <Icon name="attach_file" className="text-xl" />
                  </button>
                  <button className="flex items-center justify-center gap-2 h-9 px-6 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 shadow-md transition-all hover:shadow-lg">
                      Enviar
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};