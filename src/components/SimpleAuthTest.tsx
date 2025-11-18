import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser } from '@/store';

const SimpleAuthTest: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);
  const [credentials, setCredentials] = useState({
    username: 'admin@banco.com',
    password: 'admin123'
  });

  const handleLogin = () => {
    console.log('🚀 Intentando login con:', credentials);
    dispatch(loginUser(credentials));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Función para probar directamente la API
  const testDirectAPI = async () => {
    try {
      console.log('🧪 Probando API directamente...');
      
      const formData = new URLSearchParams();
      formData.append('username', 'admin@banco.com');
      formData.append('password', 'admin123');

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      console.log('📡 Respuesta del servidor:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
      } else {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', errorData);
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Diagnóstico de Autenticación</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Estado actual:</h2>
        <div className="space-y-2">
          <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
          <p><strong>Cargando:</strong> {isLoading ? '⏳ Sí' : '✅ No'}</p>
          <p><strong>Usuario:</strong> {user?.username || 'Ninguno'}</p>
          <p><strong>Error:</strong> {error || 'Ninguno'}</p>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Credenciales:</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
            className="border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
            className="border px-3 py-2 rounded"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Login con Redux'}
          </button>
          
          <button 
            onClick={testDirectAPI}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Probar API Directa
          </button>
          
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📋 Instrucciones de depuración:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Abre las herramientas de desarrollador (F12)</li>
          <li>Ve a la pestaña "Console"</li>
          <li>Haz clic en "Probar API Directa" primero</li>
          <li>Si funciona, prueba "Login con Redux"</li>
          <li>Revisa la pestaña "Network" para ver las peticiones HTTP</li>
          <li>Si instalaste Redux DevTools, mira el estado en tiempo real</li>
        </ol>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-red-800">❌ Error detectado:</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAuthTest;