import React, { useState } from 'react';
import DashboardHeader from '@/components/molecules/DashboardHeader';
import Sidebar from '@/components/molecules/Sidebar';
import {
  OverviewSection,
  ClientsSection,
  AccountsSection,
  AccountTypesSection,
  TransactionsSection
} from '@/components/templates';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'clients':
        return <ClientsSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'account-types':
        return <AccountTypesSection />;
      case 'transactions':
        return <TransactionsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;