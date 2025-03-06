
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
  className?: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  value,
  trend,
  className,
  children,
}) => {
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
            {trend && (
              <div className={cn(
                "text-xs",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
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
