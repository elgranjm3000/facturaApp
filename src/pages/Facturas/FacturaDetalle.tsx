import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonBadge,
} from '@ionic/react';
import { close, download } from 'ionicons/icons';
import { useClientes } from '../../context/ClientesContext';
import { useFacturas } from '../../context/FacturasContext';

interface FacturaDetalleProps {
  factura: any;
  onClose: () => void;
}

const FacturaDetalle: React.FC<FacturaDetalleProps> = ({ factura, onClose }) => {
  const { clientes } = useClientes();
  const { actualizarEstadoFactura } = useFacturas();

  const cliente = clientes.find(c => c.id === factura.clienteId);

  const descargarPDF = () => {
    // Implementar descarga de PDF aquí
    alert('Funcionalidad de descarga en desarrollo');
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{factura.numero}</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Información del Cliente */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información del Cliente</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><strong>{cliente?.nombre}</strong></p>
            <p>RIF: {cliente?.rif}</p>
            <p>Email: {cliente?.email}</p>
            <p>Teléfono: {cliente?.telefono}</p>
            <p>Dirección: {cliente?.direccion}</p>
          </IonCardContent>
        </IonCard>

        {/* Detalles de la Factura */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Detalles</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              <strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString('es-ES')}
            </p>
            <p>
              <strong>Estado:</strong>{' '}
              <IonBadge>{factura.estado}</IonBadge>
            </p>
            <p>
              <strong>Observaciones:</strong> {factura.observaciones || 'Ninguna'}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Productos */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Productos ({factura.items.length})</IonCardTitle>
          </IonCardHeader>
          <IonList>
            {factura.items.map((item: any, index: number) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{item.nombre}</h2>
                  <p>
                    {item.cantidad} x ${item.precio.toFixed(2)}
                  </p>
                </IonLabel>
                <span style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  ${(item.cantidad * item.precio).toFixed(2)}
                </span>
              </IonItem>
            ))}
          </IonList>
        </IonCard>

        {/* Resumen */}
        <IonCard>
          <IonCardContent>
            <div style={{ borderBottom: '1px solid #eee', marginBottom: '15px', paddingBottom: '15px' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                <span>Subtotal:</span>
                <strong>${factura.subtotal.toFixed(2)}</strong>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                <span>IVA Total:</span>
                <strong>${factura.totalIva.toFixed(2)}</strong>
              </p>
            </div>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
              <strong>TOTAL:</strong>
              <strong style={{ color: '#667eea' }}>
                ${factura.total.toFixed(2)}
              </strong>
            </p>
          </IonCardContent>
        </IonCard>

        {/* Cambiar Estado */}
        <IonItem>
          <IonLabel position="floating">Cambiar Estado</IonLabel>
          <IonSelect
            value={factura.estado}
            onIonChange={(e) =>
              actualizarEstadoFactura(factura.id, e.detail.value)
            }
          >
            <IonSelectOption value="Pendiente">
              Pendiente
            </IonSelectOption>
            <IonSelectOption value="Pagada">
              Pagada
            </IonSelectOption>
            <IonSelectOption value="Cancelada">
              Cancelada
            </IonSelectOption>
          </IonSelect>
        </IonItem>

        <div style={{ padding: '20px' }}>
          <IonButton expand="block" onClick={descargarPDF}>
            <IonIcon icon={download} slot="start" />
            Descargar PDF
          </IonButton>
        </div>
      </IonContent>
    </>
  );
};

export default FacturaDetalle;