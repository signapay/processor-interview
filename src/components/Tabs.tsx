import React, { useState } from 'react';
import FileUpload from './FileUpload';
import Reports from './Reports';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload />;
      case 'reports':
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="tabs">
        <button className={activeTab === 'upload' ? 'active' : ''} onClick={() => setActiveTab('upload')}>
          Upload Transactions
        </button>
        <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
          Reports
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Tabs;
