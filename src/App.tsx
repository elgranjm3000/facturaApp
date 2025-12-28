import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

import { LoginProvider } from './context/LoginContext';
import { ClientesProvider } from './context/ClientesContext';
import { ProductosProvider } from './context/ProductosContext';
import { FacturasProvider } from './context/FacturasContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <LoginProvider>
          <ClientesProvider>
            <ProductosProvider>
              <FacturasProvider>
                <IonRouterOutlet>
                  <Switch>
                    <Route path="/login" component={Login} exact />
                    <ProtectedRoute path="/" component={Navigation} />
                    <Route render={() => <Redirect to="/" />} />
                  </Switch>
                </IonRouterOutlet>
              </FacturasProvider>
            </ProductosProvider>
          </ClientesProvider>
        </LoginProvider>
      </IonReactRouter>
    </IonApp>
  );
}