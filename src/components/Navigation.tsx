import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabs,
  IonRouterOutlet,
} from '@ionic/react';
import { documentText, person, pricetag, home } from 'ionicons/icons';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClientesList from '../pages/Clientes/ClientesList';
import ProductosList from '../pages/Productos/ProductosList';
import FacturasList from '../pages/Facturas/FacturasList';

const Navigation: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <Route path="/dashboard" component={Dashboard} exact />
          <Route path="/clientes" component={ClientesList} exact />
          <Route path="/productos" component={ProductosList} exact />
          <Route path="/facturas" component={FacturasList} exact />
          <Route path="/" component={Dashboard} exact />
        </Switch>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" color="primary">
        <IonTabButton tab="dashboard" href="/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="clientes" href="/clientes">
          <IonIcon icon={person} />
          <IonLabel>Clientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="productos" href="/productos">
          <IonIcon icon={pricetag} />
          <IonLabel>Productos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="facturas" href="/facturas">
          <IonIcon icon={documentText} />
          <IonLabel>Facturas</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Navigation;