
import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">SGB</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/login">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Login</span>
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="hidden sm:inline ml-2">Cart</span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    <Link
                      to="/products"
                      className="text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/about"
                      className="text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      to="/login"
                      className="text-foreground hover:text-primary transition-colors py-2 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
