
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, LogOut, Settings, User, ChevronDown, FileText, Lock, Building, UserCircle } from "lucide-react";

const NavBar = () => {
  const { isAuthenticated, user, logout, systemLocked } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-6 bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
            <Shield className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              Lumina Search
            </span>
            <span className="block text-xs text-gray-500">Secure • Protected • Intelligent</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {systemLocked && (
            <div className="hidden md:flex items-center mr-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-red-600 animate-pulse">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">System Locked</span>
              </div>
            </div>
          )}
          
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <span className="text-sm hidden md:inline-block">Menu</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 py-2 animate-scale-in">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/privacy-policy");
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/terms-of-service");
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="block font-medium text-sm">{user?.username}</span>
                    <span className="block text-xs text-gray-500">{user?.department || 'Admin'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 py-2 animate-scale-in">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">{user?.username}</p>
                  {user?.department && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Building className="h-3 w-3 mr-1" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user?.title && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <UserCircle className="h-3 w-3 mr-1" />
                      <span>{user.title}</span>
                    </div>
                  )}
                </div>
                {user?.role === "admin" && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/admin")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/admin/firewall")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Firewall Config
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              className="rounded-full px-4 py-2 shadow-md"
              onClick={() => navigate("/login")}
            >
              <User className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
