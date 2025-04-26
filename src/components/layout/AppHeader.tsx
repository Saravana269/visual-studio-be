
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState({ username: "User", role: "Admin" });

  // Get page title based on the current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/elements":
        return "Element Manager";
      case "/coe":
        return "COE Manager";
      case "/core-set":
        return "Core Set Manager";
      case "/widgets":
        return "Widget Manager";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="app-header h-16 flex items-center justify-between px-6 text-white fixed top-0 left-0 right-0 ml-[60px] z-30">
      <div className="text-xl font-medium">{getPageTitle()}</div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 hover:bg-transparent hover:text-[#00FF00]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-[#00B86B] text-white">U</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.username}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#121212] border-[#222222] text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#222222]" />
            <DropdownMenuItem className="cursor-pointer hover:text-[#00FF00] hover:bg-[#080808]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:text-[#00FF00] hover:bg-[#080808]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#222222]" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-[#080808]"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
