
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  value?: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isPositive?: boolean; // For backward compatibility
  changeValue?: number; // For backward compatibility
  className?: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  value,
  trend,
  isPositive,
  changeValue,
  className,
  children,
}) => {
  // Convert legacy props to trend object if provided
  const trendData = trend || (
    isPositive !== undefined && changeValue !== undefined 
      ? { value: changeValue, isPositive } 
      : undefined
  );

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md glass-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{value}</div>
            {trendData && (
              <div className={cn(
                "text-xs",
                trendData.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trendData.isPositive ? "+" : "-"}{Math.abs(trendData.value)}%
              </div>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
