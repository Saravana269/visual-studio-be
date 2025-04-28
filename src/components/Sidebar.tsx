
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tag, Layers, Link, Layout, Settings, LogOut } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Logo } from "./Logo";

const menuItems = [
  { name: "Element Manager", path: "/elements", icon: <Tag size={24} /> },
  { name: "COE Manager", path: "/coe", icon: <Layers size={24} /> },
  { name: "Core Set Manager", path: "/core-set", icon: <Link size={24} /> },
  { name: "Widget Manager", path: "/widgets", icon: <Layout size={24} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={24} /> },
];

export default function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside className="sidebar flex flex-col h-screen bg-black text-gray-400 fixed left-0 top-0 z-50">
        <div className="flex items-center justify-center h-16 text-white">
          <Logo />
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 mt-6">
          {menuItems.map(item => (
            <Tooltip key={item.name} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `menu-item group flex items-center p-3 mx-2 rounded-md transition-all duration-300
                    ${isActive ? "active" : ""}`
                  }
                >
                  <div className="flex items-center justify-center w-full">
                    {item.icon}
                  </div>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={onSignOut}
              className="menu-item flex items-center justify-center p-3 mx-2 mb-6 rounded-md text-red-400 hover:text-red-300"
            >
              <LogOut size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
            Sign Out
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}
