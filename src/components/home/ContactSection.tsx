
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UtilityPole, Smartphone } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Have questions?
              </h2>
              <p className="text-lg text-gray-600 mb-6">Our team is ready to help you get started with Tripscape. Contact us for a personalized demo or to learn more about our platform.</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <UtilityPole className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-gray-600">info@manticpoint.com.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button asChild size="lg" className="animated-border-button">
                <Link to="/contact">Schedule a demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
