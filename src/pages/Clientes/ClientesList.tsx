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
  IonIcon,
  IonModal,
  IonSearchbar,
  IonChip,
} from '@ionic/react';
import { add, trash, pencil, person } from 'ionicons/icons';
import { useState } from 'react';
import { useClientes } from '../../context/ClientesContext';
import ClientesForm from './ClientesForm';
import './ClientesList.css';

const ClientesList: React.FC = () => {
  const { clientes, eliminarCliente } = useClientes();
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [clienteEditando, setClienteEditando] = useState(null);

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    c.rif.includes(searchText)
  );

  const abrirFormulario = (cliente: any = null) => {
    setClienteEditando(cliente);
    setShowModal(true);
  };

  const cerrarFormulario = () => {
    setClienteEditando(null);
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Clientes</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            className='toolbar-color'
            onClick={() => abrirFormulario()}
          >
            <IonIcon icon={add} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value || '')}
          placeholder="Buscar por nombre o RIF"
        />

        {clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={person} />
            <p>Sin clientes registrados</p>
            <IonButton onClick={() => abrirFormulario()}>
              Agregar cliente
            </IonButton>
          </div>
        ) : (
          <IonList>
            {clientesFiltrados.map(cliente => (
              <IonCard key={cliente.id} className="cliente-card">
                <IonCardContent>
                  <div className="cliente-header">
                    <div>
                      <h2>{cliente.nombre}</h2>
                      <p className="cliente-rif">RIF: {cliente.rif}</p>
                      <p className="cliente-email">{cliente.email}</p>
                      <p className="cliente-phone">{cliente.telefono}</p>
                    </div>
                    <div className="cliente-actions">
                      <IonButton
                        fill="clear"
                        size="small"
                        onClick={() => abrirFormulario(cliente)}
                      >
                        <IonIcon icon={pencil} />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        size="small"
                        color="danger"
                        onClick={() => eliminarCliente(cliente.id)}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        <IonModal isOpen={showModal} onDidDismiss={cerrarFormulario}>
          <ClientesForm
            cliente={clienteEditando}
            onSave={cerrarFormulario}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ClientesList;