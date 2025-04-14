
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { AgencyGuideCategory, AgencyGuidePage } from '@/types/onboarding.types';
import { GuidePage } from './GuidePage';
import { v4 as uuidv4 } from 'uuid';

interface GuideCategoryProps {
  category: AgencyGuideCategory;
  isExpanded: boolean;
  editingPageId: string | null;
  onExpandToggle: () => void;
  onUpdate: (updates: Partial<AgencyGuideCategory>) => void;
  onDelete: () => void;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onUpdatePage: (pageId: string, updates: Partial<AgencyGuidePage>) => void;
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
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <Input
              value={category.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Category title"
              className="font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpandToggle}
            >
              {isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
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
          <div className="space-y-4 pl-4 mt-4">
            {category.pages.map((page) => (
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
        )}
      </div>
    </Card>
  );
};
