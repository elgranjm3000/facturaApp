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
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import {
  logOut,
  documentText,
  cash,
  checkmarkCircle,
  timeOutline,
  trendingUp,
  settings,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useLogin } from '../context/LoginContext';
import { useFacturas } from '../context/FacturasContext';
import { useClientes } from '../context/ClientesContext';
import { useProductos } from '../context/ProductosContext';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const { logout, usuario } = useLogin();
  const { facturas } = useFacturas();
  const { clientes } = useClientes();
  const { productos } = useProductos();

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  // Cálculos de KPIs
  const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0);
  const facturasGeneradas = facturas.length;
  const facturasProximas = facturas.filter(f => f.estado === 'Pendiente').length;
  const facturasPagadas = facturas.filter(f => f.estado === 'Pagada').length;
  const promedioPorFactura = facturasGeneradas > 0 ? totalFacturado / facturasGeneradas : 0;

  // Últimas 3 facturas
  const ultimasFacturas = facturas.slice(-3).reverse();

  // Función para obtener nombre del cliente
  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente no identificado';
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className='toolbar-color'
          >
            <IonIcon icon={logOut} />
          </IonButton>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={settings} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-content">
        {/* Bienvenida */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h2>Bienvenido, {usuario?.nombre || 'Usuario'}</h2>
            <p>Aquí está un resumen de tu actividad</p>
          </div>
        </div>

        {/* KPIs Grid */}
        <IonGrid className="stats-grid">
          <IonRow>
            <IonCol sizeMd="6">
              <div className="stat-card primary">
                <div className="stat-icon">
                  <IonIcon icon={cash} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Facturado</p>
                  <h3>${totalFacturado.toFixed(2)}</h3>
                </div>
              </div>
            </IonCol>
            <IonCol sizeMd="6">
              <div className="stat-card success">
                <div className="stat-icon">
                  <IonIcon icon={checkmarkCircle} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Facturas Pagadas</p>
                  <h3>{facturasPagadas}</h3>
                </div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol sizeMd="6">
              <div className="stat-card warning">
                <div className="stat-icon">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Pendientes de Pago</p>
                  <h3>{facturasProximas}</h3>
                </div>
              </div>
            </IonCol>
            <IonCol sizeMd="6">
              <div className="stat-card secondary">
                <div className="stat-icon">
                  <IonIcon icon={trendingUp} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Promedio por Factura</p>
                  <h3>${promedioPorFactura.toFixed(2)}</h3>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Información General */}
        <IonCard className="info-card">
          <IonCardContent>
            <IonRow>
              <IonCol sizeMd="4" className="info-item">
                <h4>{facturasGeneradas}</h4>
                <p>Facturas Generadas</p>
              </IonCol>
              <IonCol sizeMd="4" className="info-item">
                <h4>{clientes.length}</h4>
                <p>Clientes Registrados</p>
              </IonCol>
              <IonCol sizeMd="4" className="info-item">
                <h4>{productos.length}</h4>
                <p>Productos</p>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>

        {/* Últimas Facturas */}
        {ultimasFacturas.length > 0 && (
          <IonCard className="recent-card">
            <IonCardHeader>
              <IonCardTitle>Facturas Recientes</IonCardTitle>
            </IonCardHeader>
            <IonList>
              {ultimasFacturas.map(factura => (
                <IonItem key={factura.id} className="recent-item">
                  <IonLabel>
                    <h2 className="factura-numero">{factura.numero}</h2>
                    <p className="factura-cliente">
                      {getClienteNombre(factura.clienteId)}
                    </p>
                    <p className="factura-fecha">
                      {formatearFecha(factura.fecha)}
                    </p>
                  </IonLabel>
                  <span slot="end" className="factura-monto">
                    ${factura.total.toFixed(2)}
                  </span>
                </IonItem>
              ))}
            </IonList>
          </IonCard>
        )}

        {/* Sin Facturas */}
        {ultimasFacturas.length === 0 && (
          <IonCard className="empty-state">
            <IonCardContent style={{ textAlign: 'center', padding: '40px 20px' }}>
              <IonIcon icon={documentText} style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
              <h3>Sin facturas registradas</h3>
              <p>Comienza creando tu primera factura</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* Acciones Principales */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Acciones Rápidas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="actions-container">
              <IonButton href="/facturas" expand="block" color="primary">
                <IonIcon icon={documentText} slot="start" />
                Nueva Factura
              </IonButton>
              <IonButton href="/facturas" expand="block" color="secondary">
                Ver Facturas
              </IonButton>
              <IonButton href="/clientes" expand="block" color="tertiary">
                Clientes
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;