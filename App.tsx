import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Login } from './views/Login';
import { TwoFactor } from './views/TwoFactor';
import { Dashboard } from './views/Dashboard';
import { TicketList } from './views/TicketList';
import { TicketDetail } from './views/TicketDetail';
import { ViewState, Ticket } from './types';
import { MOCK_TICKETS, CURRENT_USER } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // State lifted from constants to allow mutations (Create Ticket)
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  // Authentication Flow Handlers
  const handleLogin = () => setCurrentView('2fa');
  const handleVerify = () => setCurrentView('dashboard');
  const handleLogout = () => {
    setCurrentView('login');
    setSelectedTicketId(null);
  };

  // Navigation Handlers
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'ticket-detail') {
      setSelectedTicketId(null);
    }
  };

  const handleTicketSelect = (id: string) => {
    setSelectedTicketId(id);
    setCurrentView('ticket-detail');
  };

  // Logic to add a new ticket
  const handleAddTicket = (data: { subject: string; priority: string; description: string }) => {
    const newTicket: Ticket = {
      id: `TK-${Math.floor(10000 + Math.random() * 90000)}`, // Generate random 5 digit ID
      subject: data.subject,
      client: "Cliente Interno", // Default for manually created tickets
      priority: data.priority as 'Baja' | 'Media' | 'Alta' | 'Crítica',
      status: 'Abierto',
      assignee: CURRENT_USER, // Assign to current user by default
      lastUpdate: new Date().toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
      messages: [
         {
            id: '1',
            text: data.description,
            sender: "Juan Pérez (Tú)", // Simulating creation by current user
            avatar: CURRENT_USER.avatar,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
         }
      ]
    };

    setTickets([newTicket, ...tickets]);
  };

  // Logic to edit a ticket
  const handleEditTicket = (id: string, data: { subject: string; priority: string; description: string }) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === id) {
        // Update basic fields
        const updatedTicket = { ...ticket, subject: data.subject, priority: data.priority as any };
        
        // Update the initial description message if it exists
        if (updatedTicket.messages.length > 0 && updatedTicket.messages[0].isMe) {
            updatedTicket.messages[0].text = data.description;
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  // Logic to delete a ticket
  const handleDeleteTicket = (id: string) => {
    const filteredTickets = tickets.filter(t => t.id !== id);
    setTickets(filteredTickets);
    // If the deleted ticket was open in detail view, go back
    if (selectedTicketId === id) {
        handleNavigate('tickets');
    }
  };

  // Render logic based on state
  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === '2fa') {
    return <TwoFactor onVerify={handleVerify} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar title={currentView === 'ticket-detail' ? undefined : (currentView === 'tickets' ? 'Gestión de Tickets' : undefined)} />
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {currentView === 'dashboard' && (
            <Dashboard 
              tickets={tickets}
              onTicketSelect={handleTicketSelect} 
              onViewAll={() => setCurrentView('tickets')}
            />
          )}
          
          {currentView === 'tickets' && (
            <TicketList 
              tickets={tickets}
              onTicketSelect={handleTicketSelect}
              onCreateTicket={handleAddTicket}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {currentView === 'ticket-detail' && selectedTicketId && (
            <TicketDetail 
              ticketId={selectedTicketId} 
              tickets={tickets}
              onBack={() => handleNavigate('tickets')} 
            />
          )}

          {/* Placeholders for other views */}
          {(currentView === 'kb' || currentView === 'clients' || currentView === 'reports' || currentView === 'settings') && (
             <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl mb-4">construction</span>
                    <h2 className="text-2xl font-semibold">Página en construcción</h2>
                    <p>La sección {currentView} estará disponible pronto.</p>
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;