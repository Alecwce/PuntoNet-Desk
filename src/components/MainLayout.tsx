import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { User } from "../types";

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar
        user={user}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar
          title={
            location.pathname === "/tickets" ? "Gestión de Tickets" : undefined
          }
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};
