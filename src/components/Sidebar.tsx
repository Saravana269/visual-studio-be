
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tag, Layers, Link, Layout, Settings, LogOut } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { name: "Element Manager", path: "/elements", icon: <Tag size={24} /> },
  { name: "COE Manager", path: "/coe", icon: <Layers size={24} /> },
  { name: "Core Set Manager", path: "/core-set", icon: <Link size={24} /> },
  { name: "Widget Manager", path: "/widgets", icon: <Layout size={24} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={24} /> },
];

export default function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // Prevent default form submission behavior
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      await onSignOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col bg-black text-gray-400">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center">
          <Logo />
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2 py-4">
          {menuItems.map(item => (
            <Tooltip key={item.name} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `group relative flex items-center justify-center p-3 transition-all duration-300
                    hover:text-[#00FF00] hover:bg-[#121212]
                    ${isActive ? "text-[#00FF00] bg-[#121212]" : ""}`
                  }
                  onClick={(e) => {
                    // Prevent default if already on the same page
                    if (location.pathname === item.path) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex items-center justify-center">
                    {item.icon}
                  </div>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="bg-[#121212] text-white border-[#222222]"
              >
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        
        {/* Bottom Section with Separator */}
        <div className="pb-4">
          <Separator className="my-4 bg-[#222222]" />
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center p-3 text-red-400 hover:text-red-300 hover:bg-[#121212] transition-colors duration-300"
              >
                <LogOut size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              className="bg-[#121212] text-white border-[#222222]"
            >
              Sign Out
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
