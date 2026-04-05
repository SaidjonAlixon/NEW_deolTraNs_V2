import { createContext, useContext, useState, type ReactNode } from 'react';

interface DriverApplicationContextType {
  isOpen: boolean;
  /** Increments on each open — use to fire form_open once per open (Strict Mode safe). */
  openSessionId: number;
  openDriverModal: () => void;
  closeDriverModal: () => void;
}

const DriverApplicationContext = createContext<DriverApplicationContextType | undefined>(undefined);

export function DriverApplicationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSessionId, setOpenSessionId] = useState(0);
  const openDriverModal = () => {
    setOpenSessionId((n) => n + 1);
    setIsOpen(true);
  };
  const closeDriverModal = () => setIsOpen(false);

  return (
    <DriverApplicationContext.Provider value={{ isOpen, openSessionId, openDriverModal, closeDriverModal }}>
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
