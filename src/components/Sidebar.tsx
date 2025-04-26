
import React from "react";
import { NavLink } from "react-router-dom";
import { Tag, Layers, Link, Layout, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// SVG Logo for the sidebar
const Logo = () => (
  <svg
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const menuItems = [
  { name: "Element Manager", path: "/elements", icon: <Tag size={24} /> },
  { name: "COE Manager", path: "/coe", icon: <Layers size={24} /> },
  { name: "Core Set Manager", path: "/core-set", icon: <Link size={24} /> },
  { name: "Widget Manager", path: "/widgets", icon: <Layout size={24} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={24} /> },
];

export default function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <TooltipProvider>
      <aside className="sidebar flex flex-col h-screen bg-black text-gray-400 fixed left-0 top-0 z-50 overflow-hidden">
        <div className="flex items-center justify-center h-16 text-white">
          <Logo />
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 mt-6">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `menu-item group flex items-center p-3 mx-2 rounded-md transition-all duration-300
                  ${isActive ? "active" : ""}`
              }
            >
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="menu-text ml-3 text-sm font-medium overflow-hidden">
                  {item.name}
                </span>
              </div>
            </NavLink>
          ))}
        </nav>
        
        <button
          onClick={onSignOut}
          className="menu-item flex items-center p-3 mx-2 mb-6 rounded-md text-red-400 hover:text-red-300"
        >
          <LogOut size={24} />
          <span className="menu-text ml-3 text-sm font-medium overflow-hidden">
            Sign Out
          </span>
        </button>
      </aside>
    </TooltipProvider>
  );
}
