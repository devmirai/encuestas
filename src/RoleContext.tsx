import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RoleContextProps {
  rolId: number | null;
  setRolId: (rolId: number | null) => void;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rolId, setRolId] = useState<number | null>(null);

  return (
    <RoleContext.Provider value={{ rolId, setRolId }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};