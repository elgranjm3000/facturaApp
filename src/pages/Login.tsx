import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonLoading,
  IonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [validationError, setValidationError] = useState('');
  const history = useHistory();
  const { login, loading, error, limpiarError } = useLogin();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setValidationError('Por favor ingresa tu email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Por favor ingresa un email válido');
      return false;
    }

    if (!password) {
      setValidationError('Por favor ingresa tu contraseña');
      return false;
    }

    if (password.length < 4) {
      setValidationError('La contraseña debe tener al menos 4 caracteres');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
      history.replace('/dashboard');
    } catch (err) {
      // El error se maneja en el context
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setValidationError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidationError('');
  };

  const displayError = validationError || error;

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        <div className="login-wrapper">
          <div className="login-container">
            <IonCard className="login-card">
              <IonCardContent>
                <div className="logo-section">
                  <div className="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                      <path d="M10 17l-3-3 1.41-1.41L10 14.17l5.59-5.59L17 10" />
                    </svg>
                  </div>
                  <h1 className="login-title">FacturApp</h1>
                  <p className="login-subtitle">Sistema de Facturación</p>
                </div>

                <div className="form-section">
                  <IonItem className={validationError ? 'ion-invalid' : ''}>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput
                      type="email"
                      value={email}
                      onIonChange={(e) => handleEmailChange(e.detail.value || '')}
                      onKeyPress={handleKeyPress}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </IonItem>

                  <IonItem className={validationError ? 'ion-invalid' : ''}>
                    <IonLabel position="floating">Contraseña</IonLabel>
                    <IonInput
                      type="password"
                      value={password}
                      onIonChange={(e) => handlePasswordChange(e.detail.value || '')}
                      onKeyPress={handleKeyPress}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </IonItem>

                  {displayError && (
                    <div className="error-message">
                      <span>⚠️ {displayError}</span>
                    </div>
                  )}

                  <IonButton
                    expand="block"
                    onClick={handleLogin}
                    disabled={loading || !email || !password}
                    className="login-button"
                  >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                  </IonButton>
                </div>

                <div className="footer-section">
                  <p className="login-help">
                    ¿Olvidaste tu contraseña?{' '}
                    <a href="#recover">Recuperarla</a>
                  </p>

                  <p className="login-demo">
                    <strong>Demo:</strong> test@example.com / 123456
                  </p>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Validando credenciales..." />
        <IonToast
          isOpen={!!error}
          onDidDismiss={limpiarError}
          message={error || ''}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;