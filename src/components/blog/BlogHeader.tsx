
import React from 'react';

const BlogHeader = () => {
  return (
    <div className="bg-primary/10 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Tripscape Blog</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Latest news, travel insights, and updates on how small travel agencies are transforming their business with Tripscape.
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;
