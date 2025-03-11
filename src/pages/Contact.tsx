
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UtilityPole, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would send the message to your backend
    console.log("Form submitted:", data);
    
    // Show success message
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form
    form.reset();
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about Tripscape? Our team is here to help you get started with our services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                  <CardTitle className="text-2xl font-display">Send us a message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        {...form.register("name")} 
                        placeholder="John Doe"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...form.register("email")} 
                        placeholder="john@example.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea 
                        id="message" 
                        {...form.register("message")} 
                        placeholder="How can we help you?"
                        rows={5}
                      />
                      {form.formState.errors.message && (
                        <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Email Us</h4>
                      <p className="text-gray-600">info@tripscape.travel</p>
                      <p className="text-gray-600">support@tripscape.travel</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Call Us</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <UtilityPole className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Visit Us</h4>
                      <p className="text-gray-600">123 Travel Avenue</p>
                      <p className="text-gray-600">Suite 456</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      How do I start using Tripscape?
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">Sign up for a free account to get started with 10 free bookings per month.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      What GDS systems do you support?
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">We support Sabre, Amadeus, Travelport, and more.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      Do you offer enterprise licenses?
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">Yes, contact our sales team for custom pricing and features for high-volume agencies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
