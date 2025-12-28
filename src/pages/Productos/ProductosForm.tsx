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
import { useProductos } from '../../context/ProductosContext';

interface ProductosFormProps {
  producto?: any;
  onSave: () => void;
}

const ProductosForm: React.FC<ProductosFormProps> = ({ producto, onSave }) => {
  const { agregarProducto, editarProducto } = useProductos();
  const [formData, setFormData] = useState(
    producto || {
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      iva: 16,
    }
  );

  const handleSave = () => {
    if (!formData.nombre || !formData.precio) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (producto) {
      editarProducto(producto.id, formData);
    } else {
      agregarProducto(formData);
    }
    onSave();
  };

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: field === 'precio' || field === 'cantidad' || field === 'iva'
        ? parseFloat(value) || 0
        : value,
    });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
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
          <IonLabel position="floating">Descripción</IonLabel>
          <IonInput
            value={formData.descripcion}
            onIonChange={(e) => handleChange('descripcion', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Precio *</IonLabel>
          <IonInput
            type="number"
            inputmode="decimal"
            value={formData.precio}
            onIonChange={(e) => handleChange('precio', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Cantidad en Stock</IonLabel>
          <IonInput
            type="number"
            inputmode="numeric"
            value={formData.cantidad}
            onIonChange={(e) => handleChange('cantidad', e.detail.value)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">IVA (%)</IonLabel>
          <IonInput
            type="number"
            inputmode="decimal"
            value={formData.iva}
            onIonChange={(e) => handleChange('iva', e.detail.value)}
          />
        </IonItem>

        <div style={{ padding: '20px', marginTop: '20px' }}>
          <IonButton expand="block" color="primary" onClick={handleSave}>
            {producto ? 'Actualizar' : 'Guardar'}
          </IonButton>
        </div>
      </IonContent>
    </>
  );
};

export default ProductosForm;