
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag } from 'lucide-react';

// Sample blog data - in a real application, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'How Small Travel Agencies Can Compete with Large Online Booking Platforms',
    excerpt: 'Discover how small travel agencies are leveraging technology to provide personalized service that large platforms cannot match.',
    date: 'May 15, 2023',
    author: 'Sarah Johnson',
    category: 'Strategy',
    image: '/placeholder.svg',
    tags: ['Competition', 'Technology', 'Service']
  },
  {
    id: 2,
    title: 'The Future of Mobile Travel Management for Corporate Clients',
    excerpt: 'Mobile solutions are changing how business travelers manage their trips. Learn how agencies can capitalize on this trend.',
    date: 'June 3, 2023',
    author: 'Michael Chen',
    category: 'Mobile',
    image: '/placeholder.svg',
    tags: ['Mobile', 'Corporate Travel', 'Technology']
  },
  {
    id: 3,
    title: 'Streamlining Document Delivery for Travel Agencies',
    excerpt: 'How automating document delivery can save time, reduce errors, and improve customer satisfaction.',
    date: 'July 12, 2023',
    author: 'Emily Rodriguez',
    category: 'Operations',
    image: '/placeholder.svg',
    tags: ['Documents', 'Automation', 'Efficiency']
  },
  {
    id: 4,
    title: 'Managing Travel Risks in an Uncertain World',
    excerpt: 'Strategies for travel agencies to help clients navigate health concerns, political instability, and natural disasters.',
    date: 'August 22, 2023',
    author: 'David Patel',
    category: 'Risk Management',
    image: '/placeholder.svg',
    tags: ['Risk', 'Safety', 'Crisis Management']
  }
];

const BlogList = () => {
  return (
    <div className="space-y-8">
      {blogPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <img 
                src={post.image} 
                alt={post.title} 
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="pt-2 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="flex items-center text-xs text-gray-500"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
