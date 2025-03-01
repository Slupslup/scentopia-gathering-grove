
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Droplets } from 'lucide-react';

const ContactCTA: React.FC = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    eventType: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Inquiry received",
        description: "Thank you for your interest! We'll get back to you shortly.",
      });
      setIsLoading(false);
      setFormState({
        name: '',
        email: '',
        eventType: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <section id="contact" className="section bg-natural-100/50">
      <div className="container-content">
        <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center mb-4">
                <Droplets className="h-5 w-5 text-primary mr-2" />
                <span className="text-primary font-medium">Get in Touch</span>
              </div>
              
              <h2 className="h2 mb-6">Elevate Your Next Event</h2>
              
              <p className="text-stone-600 mb-8">
                Interested in making your upcoming event unforgettable? Contact us for information about our scent tower rental, custom fragrances, and availability.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium mb-1">
                    Event Type
                  </label>
                  <Input
                    id="eventType"
                    name="eventType"
                    value={formState.eventType}
                    onChange={handleChange}
                    placeholder="Wedding, Corporate Event, Party, etc."
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event and how we can help..."
                    rows={4}
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </div>
            
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Natural scenery"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-16 bg-gradient-to-t from-black/80 to-transparent">
                <div className="frosted-glass p-6 rounded-lg backdrop-blur-md">
                  <h3 className="text-xl font-medium text-white mb-2">Contact Information</h3>
                  <p className="text-white/90 mb-4">
                    Our team is ready to help you plan your perfect event.
                  </p>
                  <div className="space-y-2">
                    <p className="text-white/90">
                      <span className="font-medium">Email:</span> info@aromacade.com
                    </p>
                    <p className="text-white/90">
                      <span className="font-medium">Phone:</span> +1 (555) 123-4567
                    </p>
                    <p className="text-white/90">
                      <span className="font-medium">Hours:</span> Mon-Fri, 9AM-5PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
