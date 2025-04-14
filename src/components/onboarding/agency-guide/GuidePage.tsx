
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Edit2, Trash2, Globe, FileEdit, AlertCircle } from 'lucide-react';
import { AgencyGuidePage } from '@/types/onboarding.types';

interface GuidePageProps {
  page: AgencyGuidePage;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<AgencyGuidePage>) => void;
}

export const GuidePage: React.FC<GuidePageProps> = ({
  page,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  return (
    <div className="border p-3 rounded-md">
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
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
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

      {isEditing && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={page.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={page.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={page.status}
              onValueChange={(value: 'live' | 'draft' | 'deleted') => 
                onUpdate({ status: value })
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
  );
};
