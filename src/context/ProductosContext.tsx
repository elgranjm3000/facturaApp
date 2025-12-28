import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  iva: number; // porcentaje
}

interface ProductosContextType {
  productos: Producto[];
  agregarProducto: (producto: Omit<Producto, 'id'>) => void;
  editarProducto: (id: string, producto: Omit<Producto, 'id'>) => void;
  eliminarProducto: (id: string) => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>(storageService.getProductos());

  const agregarProducto = (producto: Omit<Producto, 'id'>) => {
    const nuevoProducto = storageService.agregarProducto(producto);
    setProductos([...productos, nuevoProducto]);
  };

  const editarProducto = (id: string, producto: Omit<Producto, 'id'>) => {
    storageService.editarProducto(id, producto);
    setProductos(productos.map(p => p.id === id ? { ...p, ...producto } : p));
  };

  const eliminarProducto = (id: string) => {
    storageService.eliminarProducto(id);
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <ProductosContext.Provider value={{ productos, agregarProducto, editarProducto, eliminarProducto }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de ProductosProvider');
  }
  return context;
};