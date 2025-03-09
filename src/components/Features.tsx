
import React from 'react';
import { Flower, Droplets, Leaf, Trees } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "Natural Greenery",
    description: "Lush cascading greenery flows from the top, creating a natural focal point that brings the outdoors in."
  },
  {
    icon: <Droplets className="h-6 w-6" />,
    title: "Premium Diffusion",
    description: "Our integrated oil diffuser can scent spaces up to 300m³, creating an immersive aromatic experience."
  },
  {
    icon: <Trees className="h-6 w-6" />,
    title: "Versatile Design",
    description: "The elegant bamboo base and fabric planters fit seamlessly into any venue, from grand ballrooms to intimate garden settings."
  },
  {
    icon: <Flower className="h-6 w-6" />,
    title: "Custom Fragrances",
    description: "Choose from our library of premium scents or work with our specialists to create a custom fragrance."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="section bg-stone-50">
      <div className="container-content">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h2 mb-4">Sophisticated Features</h2>
          <p className="text-stone-600">
            Our plant tower combines visual beauty with aromatic experience, designed to enhance any special occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card hover-rise">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-natural-100 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-stone-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-lg shadow-sm border border-border/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="h3 mb-4">Technical Specifications</h3>
              <p className="text-stone-600 mb-6">
                Designed for both form and function, our plant tower offers impressive technical capabilities.
              </p>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-32 font-medium">Height</div>
                  <div>180 cm</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-medium">Base</div>
                  <div>Bamboo, 40 cm diameter</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-medium">Planters</div>
                  <div>4 tiers of fabric pockets</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-medium">Coverage</div>
                  <div>Up to 300m³ (approx. 200m²)</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-medium">Plants</div>
                  <div>Selection of aromatic herbs and trailing vines</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-medium">Maintenance</div>
                  <div>Low maintenance, simple watering system</div>
                </div>
              </div>
            </div>
            
            <div className="aspect-video lg:aspect-auto relative overflow-hidden">
              <img 
                src="/lovable-uploads/6dc43b86-8650-4fd3-aecf-62287b5021d5.png" 
                alt="Aromacade Plant Tower" 
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-primary/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
