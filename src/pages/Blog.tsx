
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogList from '@/components/blog/BlogList';
import BlogSidebar from '@/components/blog/BlogSidebar';

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogHeader />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogList />
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

export default Blog;
