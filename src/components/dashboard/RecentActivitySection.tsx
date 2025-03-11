
import React from 'react';
import { BookOpen, CreditCard, Users } from 'lucide-react';

const RecentActivitySection: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
      <ul className="space-y-4">
        <li className="flex items-start gap-4 pb-4 border-b border-border">
          <div className="bg-primary/10 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">New booking processed</p>
            <p className="text-sm text-muted-foreground">NYC to SFO - John Smith</p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </li>
        <li className="flex items-start gap-4 pb-4 border-b border-border">
          <div className="bg-primary/10 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Credits purchased</p>
            <p className="text-sm text-muted-foreground">100 booking credits added</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </li>
        <li className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">New traveler added</p>
            <p className="text-sm text-muted-foreground">Sarah Johnson added to your company</p>
            <p className="text-xs text-muted-foreground">2 days ago</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RecentActivitySection;
