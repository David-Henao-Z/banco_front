import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/atoms';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Banco Digital</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleLoginClick}>
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Tu banco digital de confianza
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Ofrecemos servicios bancarios modernos y seguros para satisfacer todas tus necesidades financieras.
            </p>
           
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Servicios</h3>
            <p className="text-lg text-gray-600">Soluciones financieras adaptadas a tus necesidades</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Cuentas de Ahorro</h4>
                <p className="text-gray-600">Cuentas con las mejores tasas de interés y sin comisiones por mantenimiento.</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Préstamos</h4>
                <p className="text-gray-600">Préstamos personales e hipotecarios con tasas competitivas y procesos rápidos.</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Seguridad</h4>
                <p className="text-gray-600">Tecnología de punta para proteger tus datos y transacciones las 24 horas.</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Banca Móvil</h4>
                <p className="text-gray-600">Accede a todos nuestros servicios desde tu smartphone de forma fácil y segura.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Sobre Nosotros</h3>
              <p className="text-lg text-gray-600 mb-6">
                Somos un banco digital innovador comprometido con ofrecer servicios financieros de alta calidad 
                y tecnología de vanguardia. Nuestro objetivo es simplificar la banca y hacerla más accesible para todos.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">Más de 50,000 clientes satisfechos</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">Tecnología blockchain para máxima seguridad</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">Soporte al cliente 24/7</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h4>
              <p className="text-gray-700 mb-6">
                Democratizar el acceso a servicios financieros de calidad mediante la innovación tecnológica 
                y un enfoque centrado en el cliente.
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h4>
              <p className="text-gray-700">
                Ser el banco digital líder en América Latina, reconocido por nuestra excelencia en servicio 
                al cliente y nuestra contribución al desarrollo financiero sostenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">Banco Digital</h5>
              <p className="text-gray-400">Tu banco de confianza para el futuro digital.</p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Servicios</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Cuentas de Ahorro</li>
                <li>Préstamos</li>
                <li>Inversiones</li>
                <li>Banca Móvil</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Empresa</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nosotros</li>
                <li>Carreras</li>
                <li>Prensa</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Soporte</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Seguridad</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Banco Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;