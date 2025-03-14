
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/DashboardCard';
import { Map, Users, CreditCard } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';

const DashboardMetrics: React.FC = () => {
  const { creditInfo } = useCredits();
  const navigate = useNavigate();
  
  const handleTripTileClick = () => {
    navigate('/trip-log');
  };
  
  const handleUsersTileClick = () => {
    navigate('/users');
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        title="Total Trips" 
        value={12} 
        isPositive={true} 
        changeValue={4}
        icon={<Map className="h-8 w-8 text-primary" />}
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={handleTripTileClick}
      />
      
      <DashboardCard 
        title="Total Users" 
        value={8} 
        isPositive={true} 
        changeValue={2}
        icon={<Users className="h-8 w-8 text-primary" />}
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={handleUsersTileClick}
      />
      
      <DashboardCard 
        title="Remaining Credits" 
        value={creditInfo ? creditInfo.remainingCredits : '--'} 
        isPositive={creditInfo?.remainingCredits > 10}
        changeValue={1}
        icon={<CreditCard className="h-8 w-8 text-primary" />} 
      />
    </div>
  );
};

export default DashboardMetrics;
