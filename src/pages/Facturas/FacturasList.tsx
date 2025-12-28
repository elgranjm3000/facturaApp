import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonModal,
  IonSearchbar,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { add, trash, eye, download } from 'ionicons/icons';
import { useState } from 'react';
import { useFacturas } from '../../context/FacturasContext';
import { useClientes } from '../../context/ClientesContext';
import FacturasForm from './FacturasForm';
import FacturaDetalle from './FacturaDetalle';
import './FacturasList.css';

const FacturasList: React.FC = () => {
  const { facturas, eliminarFactura } = useFacturas();
  const { clientes } = useClientes();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  const facturasFiltradas = facturas.filter(f => {
    const cliente = clientes.find(c => c.id === f.clienteId);
    const cumpleBusqueda =
      f.numero.includes(searchText) ||
      cliente?.nombre.toLowerCase().includes(searchText.toLowerCase());

    const cumpleEstado = !filtroEstado || f.estado === filtroEstado;

    return cumpleBusqueda && cumpleEstado;
  });

  const getClienteNombre = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nombre || 'Cliente no encontrado';
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Pagada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Cancelada':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const abrirDetalle = (factura: any) => {
    setFacturaSeleccionada(factura);
    setShowDetalleModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Facturas</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            className='toolbar-color'
            onClick={() => setShowFormModal(true)}
          >
            <IonIcon icon={add} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value || '')}
          placeholder="Buscar por número o cliente"
        />

        <IonSegment
          value={filtroEstado}
          onIonChange={(e) => setFiltroEstado(e.detail.value as string)}
          style={{ padding: '10px' }}
        >
          <IonSegmentButton value="">
            <IonLabel>Todas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Pendiente">
            <IonLabel>Pendientes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Pagada">
            <IonLabel>Pagadas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Cancelada">
            <IonLabel>Canceladas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {facturasFiltradas.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={add} />
            <p>Sin facturas registradas</p>
            <IonButton onClick={() => setShowFormModal(true)}>
              Crear factura
            </IonButton>
          </div>
        ) : (
          <IonList>
            {facturasFiltradas.map(factura => (
              <IonCard key={factura.id} className="factura-card">
                <IonCardContent>
                  <div className="factura-header">
                    <div className="factura-info">
                      <h2>{factura.numero}</h2>
                      <p className="cliente-nombre">
                        {getClienteNombre(factura.clienteId)}
                      </p>
                      <p className="fecha">
                        {new Date(factura.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="factura-meta">
                      <div className="total">
                        ${factura.total.toFixed(2)}
                      </div>
                      <IonBadge color={getEstadoBadgeColor(factura.estado)}>
                        {factura.estado}
                      </IonBadge>
                    </div>
                  </div>

                  <div className="factura-actions" style={{ marginTop: '15px' }}>
                    <IonButton
                      size="small"
                      color="primary"
                      onClick={() => abrirDetalle(factura)}
                    >
                      <IonIcon icon={eye} slot="start" />
                      Ver
                    </IonButton>
                    <IonButton size="small" fill="outline">
                      <IonIcon icon={download} slot="start" />
                      PDF
                    </IonButton>
                    <IonButton
                      size="small"
                      color="danger"
                      fill="clear"
                      onClick={() => eliminarFactura(factura.id)}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        {/* Modal Crear Factura */}
        <IonModal
          isOpen={showFormModal}
          onDidDismiss={() => setShowFormModal(false)}
        >
          <FacturasForm onSave={() => setShowFormModal(false)} />
        </IonModal>

        {/* Modal Detalle */}
        <IonModal
          isOpen={showDetalleModal}
          onDidDismiss={() => setShowDetalleModal(false)}
        >
          {facturaSeleccionada && (
            <FacturaDetalle
              factura={facturaSeleccionada}
              onClose={() => setShowDetalleModal(false)}
            />
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default FacturasList;