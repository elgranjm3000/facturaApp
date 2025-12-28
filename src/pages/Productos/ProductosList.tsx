import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent,
  IonList,
  IonIcon,
  IonModal,
  IonSearchbar,
} from '@ionic/react';
import { add, trash, pencil, pricetag } from 'ionicons/icons';
import { useState } from 'react';
import { useProductos } from '../../context/ProductosContext';
import ProductosForm from './ProductosForm';
import './ProductosList.css';

const ProductosList: React.FC = () => {
  const { productos, eliminarProducto } = useProductos();
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [productoEditando, setProductoEditando] = useState(null);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const abrirFormulario = (producto: any = null) => {
    setProductoEditando(producto);
    setShowModal(true);
  };

  const cerrarFormulario = () => {
    setProductoEditando(null);
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Productos</IonTitle>
          <IonButton slot="end" fill="clear" className='toolbar-color' onClick={() => abrirFormulario()}>
            <IonIcon icon={add} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value || '')}
          placeholder="Buscar productos"
        />

        {productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={pricetag} />
            <p>Sin productos registrados</p>
            <IonButton onClick={() => abrirFormulario()}>
              Agregar producto
            </IonButton>
          </div>
        ) : (
          <IonList>
            {productosFiltrados.map(producto => (
              <IonCard key={producto.id} className="producto-card">
                <IonCardContent>
                  <div className="producto-header">
                    <div className="producto-info">
                      <h2>{producto.nombre}</h2>
                      <p className="producto-desc">{producto.descripcion}</p>
                      <div className="producto-details">
                        <span className="precio">${producto.precio.toFixed(2)}</span>
                        <span className="iva">IVA: {producto.iva}%</span>
                        <span className="cantidad">Stock: {producto.cantidad}</span>
                      </div>
                    </div>
                    <div className="producto-actions">
                      <IonButton
                        fill="clear"
                        size="small"
                        onClick={() => abrirFormulario(producto)}
                      >
                        <IonIcon icon={pencil} />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        size="small"
                        color="danger"
                        onClick={() => eliminarProducto(producto.id)}
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
          <ProductosForm
            producto={productoEditando}
            onSave={cerrarFormulario}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProductosList;