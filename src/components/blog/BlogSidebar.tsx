
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Tag } from 'lucide-react';

const BlogSidebar = () => {
  // Sample categories and tags - in a real application, these would come from an API
  const categories = [
    { name: 'Strategy', count: 12 },
    { name: 'Technology', count: 8 },
    { name: 'Operations', count: 15 },
    { name: 'Mobile', count: 6 },
    { name: 'Risk Management', count: 9 }
  ];
  
  const tags = [
    'Technology', 'Travel', 'Mobile', 'Documents', 'Customer Service', 
    'Automation', 'Risk', 'Corporate Travel', 'Efficiency', 'Competition'
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Search articles..." />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="flex justify-between items-center">
                <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                  {category.name}
                </a>
                <Badge variant="outline" className="text-xs">
                  {category.count}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-gray-100 hover:bg-primary/10 cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to our newsletter to get the latest updates and news.
          </p>
          <div className="space-y-2">
            <Input placeholder="Your email address" type="email" />
            <Button className="w-full">Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
