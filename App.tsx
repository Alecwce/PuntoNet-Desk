import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Login } from './views/Login';
import { TwoFactor } from './views/TwoFactor';
import { Dashboard } from './views/Dashboard';
import { TicketList } from './views/TicketList';
import { TicketDetail } from './views/TicketDetail';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

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
              onTicketSelect={handleTicketSelect} 
              onViewAll={() => setCurrentView('tickets')}
            />
          )}
          
          {currentView === 'tickets' && (
            <TicketList 
              onTicketSelect={handleTicketSelect}
              onNewTicket={() => alert('New Ticket Modal placeholder')}
            />
          )}

          {currentView === 'ticket-detail' && selectedTicketId && (
            <TicketDetail 
              ticketId={selectedTicketId} 
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
