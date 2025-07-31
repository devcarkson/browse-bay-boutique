
import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { categories as mockCategories } from "@/data/mockData";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Categories from backend with fallback to mock data
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const categories = categoriesData && Array.isArray(categoriesData) ? categoriesData : mockCategories;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-[100] w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              SGB
            </span>
          </Link>

          {/* Search */}
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

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-primary">Products</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            {/* Categories Dropdown */}
            <div className="relative ml-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    Categories <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {categories.map((cat) => (
                    <DropdownMenuItem asChild key={cat.id}>
                      <Link to={`/products?category=${cat.id}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Authenticated Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Login</span>
                </Link>
              </Button>
            )}

            {/* Cart */}
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

            {/* Mobile Nav */}
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

                  {/* Mobile Links */}
                  <nav className="flex flex-col space-y-4">
                    <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                    {/* Mobile Categories Dropdown */}
                    <details className="group">
                      <summary className="cursor-pointer py-2 px-1 rounded hover:bg-primary/10 hover:text-primary transition-colors font-medium">Categories</summary>
                      <div className="flex flex-col pl-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/products?category=${cat.id}`}
                            onClick={() => setIsOpen(false)}
                            className="py-1 text-sm hover:text-primary"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </details>

                    {isAuthenticated ? (
                      <>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left">Logout</button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    )}
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
