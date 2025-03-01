
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, Droplets } from 'lucide-react';
import ThreeScene from './ThreeScene';

const Hero: React.FC = () => {
  const scentRippleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!scentRippleRef.current) return;
      scentRippleRef.current.style.left = `${e.clientX}px`;
      scentRippleRef.current.style.top = `${e.clientY}px`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="product" 
      className="relative min-h-[90vh] flex items-center overflow-hidden py-20 px-4 md:px-8 bg-gradient-to-b from-natural-100/50 to-white"
    >
      <div ref={scentRippleRef} className="scent-ripple" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-natural-200/20 blur-3xl" />
      </div>
      
      <div className="container-content relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left animate-fade-in">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-secondary bg-secondary/10 text-stone-700 font-medium">
            <Droplets className="mr-1 h-3 w-3" /> Premium Scent Experience
          </Badge>
          
          <h1 className="h1 mb-6 text-balance">
            Elevate Your Events With Natural Fragrance
          </h1>
          
          <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Standing at 180 cm tall, our scent tower creates an elegant visual centerpiece 
            while diffusing beautiful aromas throughout your special gatherings.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Request Information
            </Button>
            <Button variant="outline" size="lg" className="group">
              Watch Demo
              <ArrowDownIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-natural-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 3 3 6-6" />
                </svg>
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium">Height</p>
                <p className="text-sm text-stone-500">180 cm</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-natural-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 3 3 6-6" />
                </svg>
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium">Coverage</p>
                <p className="text-sm text-stone-500">Up to 300m³</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative h-[500px] animate-fade-in animation-delay-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-md">
              <ThreeScene />
            </div>
          </div>
          
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black/5 filter blur-xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
