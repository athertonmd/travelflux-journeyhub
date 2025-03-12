
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogSidebar from '@/components/blog/BlogSidebar';

// Sample blog data - in a real application, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'How Small Travel Agencies Can Compete with Large Online Booking Platforms',
    content: `
      <p>In today's digital landscape, small travel agencies face unprecedented competition from large online booking platforms. These giants have massive marketing budgets, advanced technology, and economies of scale that can make it seem impossible for smaller agencies to compete.</p>
      
      <p>However, small travel agencies have unique advantages that, when leveraged correctly, can help them not only survive but thrive in this competitive environment.</p>
      
      <h2>The Power of Personalization</h2>
      
      <p>Unlike large booking platforms that rely on algorithms, small agencies can offer truly personalized service. This human touch is something that technology cannot replicate. By getting to know your clients personally and understanding their preferences, you can create tailored travel experiences that stand out.</p>
      
      <h2>Leveraging Technology Strategically</h2>
      
      <p>While small agencies can't match the tech budgets of major platforms, they can strategically adopt solutions like Tripscape that level the playing field. Mobile itinerary management, document delivery, and 24/7 support through technology allow smaller agencies to offer comparable convenience while maintaining their personal touch.</p>
      
      <h2>Specialization as a Competitive Edge</h2>
      
      <p>Instead of trying to be everything to everyone, successful small agencies often focus on specific niches. Whether it's luxury travel, adventure tourism, or corporate travel for particular industries, specialization allows you to develop deep expertise that generalist platforms cannot match.</p>
      
      <h2>Building Community Connections</h2>
      
      <p>Local agencies have the advantage of being part of their communities. Building partnerships with local businesses, participating in community events, and leveraging word-of-mouth referrals creates a network that online giants struggle to replicate.</p>
      
      <h2>Conclusion</h2>
      
      <p>The future of small travel agencies isn't about competing with online platforms on their terms. It's about emphasizing distinctly human strengths—personalization, expertise, relationships, and community—while using technology to enhance rather than replace these advantages.</p>
      
      <p>By combining the right technology solutions with the irreplaceable human elements of travel planning, small agencies can create a competitive advantage that ensures their place in the travel ecosystem of tomorrow.</p>
    `,
    date: 'May 15, 2023',
    author: 'Sarah Johnson',
    category: 'Strategy',
    image: '/placeholder.svg',
    tags: ['Competition', 'Technology', 'Service']
  },
  {
    id: 2,
    title: 'The Future of Mobile Travel Management for Corporate Clients',
    content: '<p>This is a placeholder for the full article content...</p>',
    date: 'June 3, 2023',
    author: 'Michael Chen',
    category: 'Mobile',
    image: '/placeholder.svg',
    tags: ['Mobile', 'Corporate Travel', 'Technology']
  },
  {
    id: 3,
    title: 'Streamlining Document Delivery for Travel Agencies',
    content: '<p>This is a placeholder for the full article content...</p>',
    date: 'July 12, 2023',
    author: 'Emily Rodriguez',
    category: 'Operations',
    image: '/placeholder.svg',
    tags: ['Documents', 'Automation', 'Efficiency']
  },
  {
    id: 4,
    title: 'Managing Travel Risks in an Uncertain World',
    content: '<p>This is a placeholder for the full article content...</p>',
    date: 'August 22, 2023',
    author: 'David Patel',
    category: 'Risk Management',
    image: '/placeholder.svg',
    tags: ['Risk', 'Safety', 'Crisis Management']
  }
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  const post = blogPosts.find(post => post.id === postId) || blogPosts[0];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>
                  
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-gray-100 hover:bg-primary/10 cursor-pointer transition-colors"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
