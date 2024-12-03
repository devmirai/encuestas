import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RoleContextProps {
  rolId: number | null;
  setRolId: (rolId: number | null) => void;
  userId: number | null;
  setUserId: (userId: number | null) => void;
  nombre: string | null;
  setNombre: (nombre: string | null) => void;
  apellido: string | null;
  setApellido: (apellido: string | null) => void;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rolId, setRolId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);

  return (
    <RoleContext.Provider value={{ rolId, setRolId, userId, setUserId, nombre, setNombre, apellido, setApellido }}>
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