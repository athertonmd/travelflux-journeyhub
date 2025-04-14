
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AgencyGuidePage } from '@/types/onboarding.types';
import { GuidePage } from './GuidePage';

interface PageListProps {
  pages: AgencyGuidePage[];
  editingPageId: string | null;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onUpdatePage: (pageId: string, updates: Partial<AgencyGuidePage>) => void;
  onDeletePage: (pageId: string) => void;
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  editingPageId,
  onAddPage,
  onEditPage,
  onUpdatePage,
  onDeletePage,
}) => {
  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <GuidePage
          key={page.id}
          page={page}
          isEditing={editingPageId === page.id}
          onEdit={() => onEditPage(page.id)}
          onDelete={() => onDeletePage(page.id)}
          onUpdate={(updates) => onUpdatePage(page.id, updates)}
        />
      ))}
      
      <Button
        onClick={onAddPage}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Page
      </Button>
    </div>
  );
};
