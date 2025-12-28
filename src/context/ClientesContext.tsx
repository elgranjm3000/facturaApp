import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';

interface Cliente {
  id: string;
  nombre: string;
  rif: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface ClientesContextType {
  clientes: Cliente[];
  agregarCliente: (cliente: Omit<Cliente, 'id'>) => void;
  editarCliente: (id: string, cliente: Omit<Cliente, 'id'>) => void;
  eliminarCliente: (id: string) => void;
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined);

export const ClientesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>(storageService.getClientes());

  const agregarCliente = (cliente: Omit<Cliente, 'id'>) => {
    const nuevoCliente = storageService.agregarCliente(cliente);
    setClientes([...clientes, nuevoCliente]);
  };

  const editarCliente = (id: string, cliente: Omit<Cliente, 'id'>) => {
    storageService.editarCliente(id, cliente);
    setClientes(clientes.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const eliminarCliente = (id: string) => {
    storageService.eliminarCliente(id);
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <ClientesContext.Provider value={{ clientes, agregarCliente, editarCliente, eliminarCliente }}>
      {children}
    </ClientesContext.Provider>
  );
};

export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error('useClientes debe usarse dentro de ClientesProvider');
  }
  return context;
};