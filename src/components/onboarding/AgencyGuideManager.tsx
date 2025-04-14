
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgencyGuideCategory, AgencyGuidePage } from '@/types/onboarding.types';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, Globe, FileEdit, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
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
  const [editingPage, setEditingPage] = useState<AgencyGuidePage | null>(null);

  const addCategory = () => {
    const newCategory: AgencyGuideCategory = {
      id: uuidv4(),
      title: 'New Category',
      position: categories.length + 1,
      pages: []
    };
    onUpdate([...categories, newCategory]);
  };

  const updateCategory = (categoryId: string, updates: Partial<AgencyGuideCategory>) => {
    onUpdate(
      categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    onUpdate(categories.filter(cat => cat.id !== categoryId));
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
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <Input
                    value={category.title}
                    onChange={(e) => updateCategory(category.id, { title: e.target.value })}
                    placeholder="Category title"
                    className="font-medium"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                  >
                    {expandedCategory === category.id ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedCategory === category.id && (
                <div className="space-y-4 pl-4 mt-4">
                  {category.pages.map((page) => (
                    <div key={page.id} className="border p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {page.status === 'live' && <Globe className="h-4 w-4 text-green-500" />}
                          {page.status === 'draft' && <FileEdit className="h-4 w-4 text-yellow-500" />}
                          {page.status === 'deleted' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          <span>{page.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPage(editingPage?.id === page.id ? null : page)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePage(category.id, page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingPage?.id === page.id && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={page.title}
                              onChange={(e) => updatePage(category.id, page.id, { title: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                              value={page.content}
                              onChange={(e) => updatePage(category.id, page.id, { content: e.target.value })}
                              rows={5}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Status</Label>
                            <RadioGroup
                              value={page.status}
                              onValueChange={(value: 'live' | 'draft' | 'deleted') => 
                                updatePage(category.id, page.id, { status: value })
                              }
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="live" id={`${page.id}-live`} />
                                <Label htmlFor={`${page.id}-live`}>Live</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="draft" id={`${page.id}-draft`} />
                                <Label htmlFor={`${page.id}-draft`}>Draft</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="deleted" id={`${page.id}-deleted`} />
                                <Label htmlFor={`${page.id}-deleted`}>Deleted</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => addPage(category.id)}
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
        ))}
      </div>
    </div>
  );
};
