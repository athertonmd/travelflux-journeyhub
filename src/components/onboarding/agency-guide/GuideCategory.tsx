import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from 'lucide-react';
import { AgencyGuideCategory } from '@/types/onboarding.types';
import { PageList } from './PageList';
import { Input } from '@/components/ui/input';

interface GuideCategoryProps {
  category: AgencyGuideCategory;
  isExpanded: boolean;
  editingPageId: string | null;
  onExpandToggle: () => void;
  onUpdate: (updates: Partial<AgencyGuideCategory>) => void;
  onDelete: () => void;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onUpdatePage: (pageId: string, updates: Partial<any>) => void;
  onDeletePage: (pageId: string) => void;
}

export const GuideCategory: React.FC<GuideCategoryProps> = ({
  category,
  isExpanded,
  editingPageId,
  onExpandToggle,
  onUpdate,
  onDelete,
  onAddPage,
  onEditPage,
  onUpdatePage,
  onDeletePage,
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={category.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-lg font-medium m-0 p-0 border-none focus-visible:ring-0 focus-visible:ring-transparent shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpandToggle}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <PageList
            pages={category.pages}
            editingPageId={editingPageId}
            onAddPage={onAddPage}
            onEditPage={onEditPage}
            onUpdatePage={onUpdatePage}
            onDeletePage={onDeletePage}
          />
        </div>
      )}
    </div>
  );
};
