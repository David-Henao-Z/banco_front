import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: 'overview', label: 'Resumen General', icon: '📊' },
  { id: 'clients', label: 'Clientes', icon: '👥' },
  { id: 'accounts', label: 'Cuentas', icon: '💳' },
  { id: 'account-types', label: 'Tipos de Cuenta', icon: '🏦' },
  { id: 'transactions', label: 'Transacciones', icon: '💰' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Menú Principal
        </h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;