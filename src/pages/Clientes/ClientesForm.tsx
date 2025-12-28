import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useState } from 'react';
import { useClientes } from '../../context/ClientesContext';

interface ClientesFormProps {
  cliente?: any;
  onSave: () => void;
}

const ClientesForm: React.FC<ClientesFormProps> = ({ cliente, onSave }) => {
  const { agregarCliente, editarCliente } = useClientes();
  const [formData, setFormData] = useState(
    cliente || {
      nombre: '',
      rif: '',
      email: '',
      telefono: '',
      direccion: '',
    }
  );

  const handleSave = () => {
    if (!formData.nombre || !formData.rif) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (cliente) {
      editarCliente(cliente.id, formData);
    } else {
      agregarCliente(formData);
    }
    onSave();
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </IonTitle>
          <IonButton slot="end" fill="clear" onClick={onSave}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="floating">Nombre *</IonLabel>
          <IonInput
            value={formData.nombre}
            onIonChange={(e) => handleChange('nombre', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">RIF *</IonLabel>
          <IonInput
            value={formData.rif}
            onIonChange={(e) => handleChange('rif', e.detail.value)}
            placeholder="V-12345678"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={formData.email}
            onIonChange={(e) => handleChange('email', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput
            value={formData.telefono}
            onIonChange={(e) => handleChange('telefono', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Dirección</IonLabel>
          <IonInput
            value={formData.direccion}
            onIonChange={(e) => handleChange('direccion', e.detail.value)}
          />
        </IonItem>

        <div style={{ padding: '20px', marginTop: '20px' }}>
          <IonButton expand="block" color="primary" onClick={handleSave}>
            {cliente ? 'Actualizar' : 'Guardar'}
          </IonButton>
        </div>
      </IonContent>
    </>
  );
};

export default ClientesForm;