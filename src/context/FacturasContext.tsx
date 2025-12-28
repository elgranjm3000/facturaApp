import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';

interface ItemFactura {
  productoId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  iva: number;
  subtotal: number;
}

export interface Factura {
  id: string;
  numero: string;
  clienteId: string;
  fecha: string;
  items: ItemFactura[];
  subtotal: number;
  totalIva: number;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Cancelada';
  observaciones: string;
}

interface FacturasContextType {
  facturas: Factura[];
  agregarFactura: (factura: Omit<Factura, 'id' | 'numero' | 'fecha' | 'estado'>) => Factura;
  editarFactura: (id: string, factura: Partial<Factura>) => void;
  eliminarFactura: (id: string) => void;
  getFacturaById: (id: string) => Factura | undefined;
  actualizarEstadoFactura: (id: string, estado: Factura['estado']) => void;
}

const FacturasContext = createContext<FacturasContextType | undefined>(undefined);

export const FacturasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facturas, setFacturas] = useState<Factura[]>(storageService.getFacturas());

  const agregarFactura = (factura: Omit<Factura, 'id' | 'numero' | 'fecha' | 'estado'>) => {
    const nuevaFactura = storageService.agregarFactura(factura);
    setFacturas([...facturas, nuevaFactura]);
    return nuevaFactura;
  };

  const editarFactura = (id: string, factura: Partial<Factura>) => {
    storageService.editarFactura(id, factura);
    setFacturas(facturas.map(f => f.id === id ? { ...f, ...factura } : f));
  };

  const eliminarFactura = (id: string) => {
    storageService.eliminarFactura(id);
    setFacturas(facturas.filter(f => f.id !== id));
  };

  const getFacturaById = (id: string) => {
    return facturas.find(f => f.id === id);
  };

  const actualizarEstadoFactura = (id: string, estado: Factura['estado']) => {
    storageService.actualizarEstadoFactura(id, estado);
    setFacturas(facturas.map(f => f.id === id ? { ...f, estado } : f));
  };

  return (
    <FacturasContext.Provider
      value={{
        facturas,
        agregarFactura,
        editarFactura,
        eliminarFactura,
        getFacturaById,
        actualizarEstadoFactura,
      }}
    >
      {children}
    </FacturasContext.Provider>
  );
};

export const useFacturas = () => {
  const context = useContext(FacturasContext);
  if (!context) {
    throw new Error('useFacturas debe usarse dentro de FacturasProvider');
  }
  return context;
};