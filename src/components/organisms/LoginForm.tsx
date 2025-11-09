import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@/components/atoms';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearAuthError } from '@/store';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '', // Credenciales por defecto
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    if (!credentials.username.trim()) {
      errors.username = 'El usuario es requerido';
    }

    if (!credentials.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 4) {
      errors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear general error
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the reducer
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Banco Digital</h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <Card>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Credenciales de prueba:</strong><br />
              Usuario: admin@banco.com<br />
              Contraseña: admin123
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="username"
              type="text"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={credentials.username}
              onChange={handleInputChange}
              error={validationErrors.username}
              required
            />

            <Input
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={credentials.password}
              onChange={handleInputChange}
              error={validationErrors.password}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Olvidaste tu contraseña?{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Recupérala aquí
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Términos y Condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;