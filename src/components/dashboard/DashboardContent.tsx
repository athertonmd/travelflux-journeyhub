
import React from 'react';
import RecentActivitySection from '@/components/dashboard/RecentActivitySection';

const DashboardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-3">
        <RecentActivitySection />
      </div>
    </div>
  );
};

export default DashboardContent;
