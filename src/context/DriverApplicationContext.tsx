import { createContext, useContext, useState, type ReactNode } from 'react';

interface DriverApplicationContextType {
  isOpen: boolean;
  openDriverModal: () => void;
  closeDriverModal: () => void;
}

const DriverApplicationContext = createContext<DriverApplicationContextType | undefined>(undefined);

export function DriverApplicationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openDriverModal = () => setIsOpen(true);
  const closeDriverModal = () => setIsOpen(false);

  return (
    <DriverApplicationContext.Provider value={{ isOpen, openDriverModal, closeDriverModal }}>
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
