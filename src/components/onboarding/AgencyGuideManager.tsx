
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AgencyGuideCategory, AgencyGuidePage } from '@/types/onboarding.types';
import { GuideCategory } from './agency-guide/GuideCategory';
import { v4 as uuidv4 } from 'uuid';

interface AgencyGuideManagerProps {
  categories: AgencyGuideCategory[];
  onUpdate: (categories: AgencyGuideCategory[]) => void;
}

export const AgencyGuideManager: React.FC<AgencyGuideManagerProps> = ({
  categories,
  onUpdate,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const addCategory = () => {
    const newCategory: AgencyGuideCategory = {
      id: uuidv4(),
      title: 'New Category',
      position: categories.length + 1,
      pages: []
    };
    onUpdate([...categories, newCategory]);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newCategories[index], newCategories[newIndex]] = [
      newCategories[newIndex],
      newCategories[index]
    ];
    
    // Update position values to match new order
    const updatedCategories = newCategories.map((cat, idx) => ({
      ...cat,
      position: idx + 1
    }));
    
    onUpdate(updatedCategories);
  };

  const updateCategory = (categoryId: string, updates: Partial<AgencyGuideCategory>) => {
    onUpdate(
      categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories
      .filter(cat => cat.id !== categoryId)
      .map((cat, idx) => ({
        ...cat,
        position: idx + 1
      }));
    onUpdate(updatedCategories);
  };

  const addPage = (categoryId: string) => {
    const newPage: AgencyGuidePage = {
      id: uuidv4(),
      title: 'New Page',
      content: '',
      status: 'draft'
    };
    
    onUpdate(
      categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, pages: [...cat.pages, newPage] }
          : cat
      )
    );
  };

  const updatePage = (categoryId: string, pageId: string, updates: Partial<AgencyGuidePage>) => {
    onUpdate(
      categories.map(cat => 
        cat.id === categoryId
          ? {
              ...cat,
              pages: cat.pages.map(page =>
                page.id === pageId ? { ...page, ...updates } : page
              )
            }
          : cat
      )
    );
  };

  const deletePage = (categoryId: string, pageId: string) => {
    onUpdate(
      categories.map(cat => 
        cat.id === categoryId
          ? { ...cat, pages: cat.pages.filter(page => page.id !== pageId) }
          : cat
      )
    );
  };

  // Sort categories by position before rendering
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Agency Guide Content</h3>
        <Button onClick={addCategory} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-4">
        {sortedCategories.map((category, index) => (
          <GuideCategory
            key={category.id}
            category={category}
            isExpanded={expandedCategory === category.id}
            editingPageId={editingPage}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
            onExpandToggle={() => setExpandedCategory(
              expandedCategory === category.id ? null : category.id
            )}
            onUpdate={(updates) => updateCategory(category.id, updates)}
            onDelete={() => deleteCategory(category.id)}
            onAddPage={() => addPage(category.id)}
            onEditPage={(pageId) => setEditingPage(
              editingPage === pageId ? null : pageId
            )}
            onUpdatePage={(pageId, updates) => updatePage(category.id, pageId, updates)}
            onDeletePage={(pageId) => deletePage(category.id, pageId)}
            onMoveUp={() => moveCategory(index, 'up')}
            onMoveDown={() => moveCategory(index, 'down')}
          />
        ))}
      </div>
    </div>
  );
};
