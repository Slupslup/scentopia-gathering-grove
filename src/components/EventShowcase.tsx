
import React from 'react';
import { PartyPopper, Leaf, WineOff } from 'lucide-react'; 
import { Badge } from "@/components/ui/badge";

const events = [
  {
    title: "Weddings",
    description: "Create unforgettable memories with custom scents that complement your floral arrangements and theme.",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Leaf />,
    color: "natural"
  },
  {
    title: "Corporate Events",
    description: "Enhance brand experiences with signature scents that create a cohesive sensory environment.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <WineOff />,
    color: "stone"
  },
  {
    title: "Private Parties",
    description: "Make your celebration stand out with a scent tower that doubles as a stunning visual centerpiece.",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <PartyPopper />,
    color: "cream"
  }
];

const EventShowcase: React.FC = () => {
  return (
    <section id="events" className="section bg-white">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h2 mb-4">Perfect For Any Occasion</h2>
          <p className="text-stone-600">
            Our scent tower enhances the atmosphere of any gathering, creating a multi-sensory experience for your guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {events.map((event, index) => (
            <div key={index} className="event-card group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity group-hover:opacity-70"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <Badge 
                    variant="outline" 
                    className={`mb-2 border-${event.color}-200 bg-${event.color}-100/40 backdrop-blur-sm text-stone-800`}
                  >
                    <span className="mr-1">{event.icon}</span> {event.title}
                  </Badge>
                  <h3 className="text-xl font-medium text-white mb-1">{event.title}</h3>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                <p className="text-stone-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-natural-100/50 rounded-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-natural-200/40 blur-3xl transform translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h3 className="h3 mb-4">Testimonials</h3>
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-natural-200/50">
                <div className="flex space-x-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 flex-shrink-0">
                    <span className="text-lg font-serif">J</span>
                  </div>
                  <div>
                    <p className="italic text-stone-600 mb-3">
                      "The scent tower was the perfect addition to our wedding reception. Guests kept commenting on how amazing the venue smelled, and it looked absolutely stunning with our floral arrangements."
                    </p>
                    <p className="font-medium">Jennifer & Michael</p>
                    <p className="text-sm text-stone-500">Spring Wedding</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border border-natural-200/50">
                <div className="flex space-x-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 flex-shrink-0">
                    <span className="text-lg font-serif">S</span>
                  </div>
                  <div>
                    <p className="italic text-stone-600 mb-3">
                      "We used the scent tower for our annual corporate gala, and it created such a sophisticated atmosphere. The customized fragrance aligned perfectly with our brand, and the tower itself was a conversation starter."
                    </p>
                    <p className="font-medium">Sarah Thompson</p>
                    <p className="text-sm text-stone-500">Event Director, Elevate Inc.</p>
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

export default EventShowcase;
