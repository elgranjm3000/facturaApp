import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonList,
} from '@ionic/react';
import { close, trash } from 'ionicons/icons';
import { useState } from 'react';
import { useFacturas } from '../../context/FacturasContext';
import { useClientes } from '../../context/ClientesContext';
import { useProductos } from '../../context/ProductosContext';

interface FacturasFormProps {
  onSave: () => void;
}

const FacturasForm: React.FC<FacturasFormProps> = ({ onSave }) => {
  const { agregarFactura } = useFacturas();
  const { clientes } = useClientes();
  const { productos } = useProductos();

  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [observaciones, setObservaciones] = useState('');

  const productoActual = productos.find(p => p.id === productoSeleccionado);

  const agregarItem = () => {
    if (!productoSeleccionado || cantidadSeleccionada <= 0) {
      alert('Selecciona un producto y cantidad válida');
      return;
    }

    const producto = productos.find(p => p.id === productoSeleccionado)!;
    const subtotal = producto.precio * cantidadSeleccionada;
    const iva = subtotal * (producto.iva / 100);

    const nuevoItem = {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: cantidadSeleccionada,
      precio: producto.precio,
      iva: producto.iva,
      subtotal: subtotal + iva,
    };

    setItems([...items, nuevoItem]);
    setProductoSeleccionado('');
    setCantidadSeleccionada(1);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    const totalIva = items.reduce(
      (sum, item) => sum + (item.precio * item.cantidad * item.iva) / 100,
      0
    );
    const total = subtotal + totalIva;

    return { subtotal, totalIva, total };
  };

  const handleGuardar = () => {
    if (!clienteId || items.length === 0) {
      alert('Selecciona un cliente y agrega productos');
      return;
    }

    const { subtotal, totalIva, total } = calcularTotales();

    agregarFactura({
      clienteId,
      items,
      subtotal,
      totalIva,
      total,
      observaciones,
    });

    onSave();
  };

  const { subtotal, totalIva, total } = calcularTotales();

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Nueva Factura</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onSave}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Selección de Cliente */}
        <IonItem>
          <IonLabel position="floating">Cliente *</IonLabel>
          <IonSelect value={clienteId} onIonChange={(e) => setClienteId(e.detail.value)}>
            {clientes.map(cliente => (
              <IonSelectOption key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Agregar Productos */}
        <div style={{ padding: '15px' }}>
          <h3>Agregar Productos</h3>
          <IonItem>
            <IonLabel position="floating">Producto</IonLabel>
            <IonSelect
              value={productoSeleccionado}
              onIonChange={(e) => setProductoSeleccionado(e.detail.value)}
            >
              {productos.map(producto => (
                <IonSelectOption key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precio.toFixed(2)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Cantidad</IonLabel>
            <IonInput
              type="number"
              inputmode="numeric"
              value={cantidadSeleccionada}
              onIonChange={(e) => setCantidadSeleccionada(parseInt(e.detail.value!) || 1)}
            />
          </IonItem>

          {productoActual && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <p>
                Subtotal: ${(productoActual.precio * cantidadSeleccionada).toFixed(2)}
              </p>
              <p>
                IVA ({productoActual.iva}%): ${(
                  (productoActual.precio * cantidadSeleccionada * productoActual.iva) /
                  100
                ).toFixed(2)}
              </p>
              <p style={{ fontWeight: 'bold' }}>
                Total: ${(
                  productoActual.precio * cantidadSeleccionada +
                  (productoActual.precio * cantidadSeleccionada * productoActual.iva) / 100
                ).toFixed(2)}
              </p>
            </div>
          )}

          <IonButton expand="block" color="secondary" onClick={agregarItem} style={{ marginTop: '15px' }}>
            Agregar a la Factura
          </IonButton>
        </div>

        {/* Lista de Items */}
        {items.length > 0 && (
          <div style={{ padding: '15px' }}>
            <h3>Productos en la Factura ({items.length})</h3>
            <IonList>
              {items.map((item, index) => (
                <IonCard key={index} style={{ margin: '10px 0' }}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{item.nombre}</h4>
                        <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                          {item.cantidad} x ${item.precio.toFixed(2)} = ${(item.cantidad * item.precio).toFixed(2)}
                        </p>
                      </div>
                      <IonButton
                        fill="clear"
                        size="small"
                        color="danger"
                        onClick={() => eliminarItem(index)}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </div>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                      IVA: ${((item.cantidad * item.precio * item.iva) / 100).toFixed(2)}
                    </p>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          </div>
        )}

        {/* Observaciones */}
        <IonItem>
          <IonLabel position="floating">Observaciones</IonLabel>
          <IonInput
            value={observaciones}
            onIonChange={(e) => setObservaciones(e.detail.value || '')}
          />
        </IonItem>

        {/* Resumen */}
        {items.length > 0 && (
          <IonCard style={{ margin: '15px' }}>
            <IonCardContent>
              <h3 style={{ margin: '0 0 15px 0' }}>Resumen</h3>
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span>Subtotal:</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span>IVA Total:</span>
                  <strong>${totalIva.toFixed(2)}</strong>
                </p>
              </div>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0', fontSize: '18px' }}>
                <span>TOTAL:</span>
                <strong style={{ color: '#667eea' }}>${total.toFixed(2)}</strong>
              </p>
            </IonCardContent>
          </IonCard>
        )}

        <div style={{ padding: '20px' }}>
          <IonButton
            expand="block"
            color="primary"
            onClick={handleGuardar}
            disabled={!clienteId || items.length === 0}
          >
            Guardar Factura
          </IonButton>
        </div>
      </IonContent>
    </>
  );
};

export default FacturasForm;