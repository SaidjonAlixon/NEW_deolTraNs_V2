import { createContext, useContext, useState, type ReactNode } from 'react';

interface DriverApplicationContextType {
  isOpen: boolean;
  /** Increments on each open — use to fire form_open once per open (Strict Mode safe). */
  openSessionId: number;
  openDriverModal: () => void;
  closeDriverModal: () => void;
  isQuickContactOpen: boolean;
  openQuickContactModal: () => void;
  closeQuickContactModal: () => void;
}

const DriverApplicationContext = createContext<DriverApplicationContextType | undefined>(undefined);

export function DriverApplicationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSessionId, setOpenSessionId] = useState(0);
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);

  const openDriverModal = () => {
    setIsQuickContactOpen(false);
    setOpenSessionId((n) => n + 1);
    setIsOpen(true);
  };
  const closeDriverModal = () => setIsOpen(false);

  const openQuickContactModal = () => {
    setIsOpen(false);
    setIsQuickContactOpen(true);
  };
  const closeQuickContactModal = () => setIsQuickContactOpen(false);

  return (
    <DriverApplicationContext.Provider
      value={{
        isOpen,
        openSessionId,
        openDriverModal,
        closeDriverModal,
        isQuickContactOpen,
        openQuickContactModal,
        closeQuickContactModal,
      }}
    >
      {children}
    </DriverApplicationContext.Provider>
  );
}

export function useDriverApplication() {
  const context = useContext(DriverApplicationContext);
  if (context === undefined) {
    throw new Error('useDriverApplication must be used within a DriverApplicationProvider');
  }
  return context;
}
