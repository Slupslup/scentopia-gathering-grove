
import React from 'react';
import { Leaf } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-400">
      <header className="py-6 px-6 md:px-10 border-b border-border/30 sticky top-0 z-50 bg-dark-400/90 backdrop-blur-md">
        <div className="container-content flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-medium">Aromacade</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#product" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Product
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#events" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Events
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-12 px-6 md:px-10 bg-dark-300 border-t border-border/30">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-medium">Aromacade</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Elevating experiences through carefully crafted scents and elegant design.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#product" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Our Product
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Events
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors block mb-2">
                Get in Touch
              </a>
              <a href="mailto:info@aromacade.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                info@aromacade.com
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border/20 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aromacade. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
