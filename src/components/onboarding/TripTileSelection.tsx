
import React from 'react';
import { Check } from 'lucide-react';

const tripTileOptions = [
  {
    id: 'upcoming',
    title: 'Upcoming Trips',
    description: 'Display traveler\'s upcoming bookings',
    icon: '✈️'
  },
  {
    id: 'weather',
    title: 'Destination Weather',
    description: 'Show weather forecast for travel destinations',
    icon: '🌤️'
  },
  {
    id: 'documents',
    title: 'Travel Documents',
    description: 'Quick access to tickets, vouchers and itineraries',
    icon: '📄'
  },
  {
    id: 'alerts',
    title: 'Travel Alerts',
    description: 'Important notifications about trips',
    icon: '🔔'
  },
  {
    id: 'checkin',
    title: 'Check-in',
    description: 'Flight check-in reminders and links',
    icon: '✓'
  },
  {
    id: 'assistance',
    title: 'Travel Assistance',
    description: 'Help and support contact information',
    icon: '🆘'
  },
  {
    id: 'expenses',
    title: 'Expense Tracking',
    description: 'Log and manage travel expenses',
    icon: '💰'
  },
  {
    id: 'maps',
    title: 'Destination Maps',
    description: 'Maps and directions for destinations',
    icon: '🗺️'
  },
  {
    id: 'loyalty',
    title: 'Loyalty Programs',
    description: 'View and manage loyalty program status',
    icon: '⭐'
  },
  {
    id: 'safety',
    title: 'Safety Information',
    description: 'Local emergency contacts and safety tips',
    icon: '🛡️'
  }
];

interface TripTileSelectionProps {
  selected: string[];
  onUpdate: (selected: string[]) => void;
}

const TripTileSelection: React.FC<TripTileSelectionProps> = ({ selected, onUpdate }) => {
  const handleSelect = (tileId: string) => {
    if (selected.includes(tileId)) {
      // Remove the tile
      onUpdate(selected.filter(id => id !== tileId));
    } else {
      // Add the tile, but limit to 4
      if (selected.length < 4) {
        onUpdate([...selected, tileId]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Select up to 4 trip tiles that will appear on your travelers' mobile app home screen.
        Choose the most relevant information for your travelers.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tripTileOptions.map((tile) => (
          <div 
            key={tile.id}
            onClick={() => handleSelect(tile.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-colors
              ${selected.includes(tile.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-gray-300'
              }
              ${selected.length >= 4 && !selected.includes(tile.id) ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-start">
              <div className="text-2xl mr-3">{tile.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium">{tile.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{tile.description}</p>
              </div>
              {selected.includes(tile.id) && (
                <div className="bg-primary text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-gray-600">
          {selected.length} of 4 tiles selected
        </span>
        
        {selected.length >= 4 && (
          <span className="text-amber-600 font-medium">
            Maximum of 4 tiles reached
          </span>
        )}
      </div>
    </div>
  );
};

export default TripTileSelection;
