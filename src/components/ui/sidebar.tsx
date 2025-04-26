import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  TagIcon,
  Squares2X2Icon,
  LinkIcon,
  RectangleStackIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Element Manager", path: "/elements", icon: <TagIcon className="h-6 w-6" /> },
  { name: "COE Manager", path: "/coe", icon: <Squares2X2Icon className="h-6 w-6" /> },
  { name: "Core Set Manager", path: "/core-set", icon: <LinkIcon className="h-6 w-6" /> },
  { name: "Widget Manager", path: "/widgets", icon: <RectangleStackIcon className="h-6 w-6" /> },
  { name: "Settings", path: "/settings", icon: <Cog6ToothIcon className="h-6 w-6" /> },
];

export default function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const location = useLocation();

  return (
    <aside className="flex flex-col h-screen w-16 bg-gray-900 text-gray-400 shadow-lg fixed left-0 top-0 z-40">
      <nav className="flex-1 flex flex-col gap-2 mt-6">
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `group flex items-center justify-center h-12 w-12 mx-auto rounded-lg transition-colors
                ${isActive ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800 hover:text-white"}`
            }
          >
            <span className="sr-only">{item.name}</span>
            <div className="relative flex items-center justify-center">
              {item.icon}
              <span className="absolute left-14 z-50 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow transition-opacity pointer-events-none whitespace-nowrap">
                {item.name}
              </span>
            </div>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onSignOut}
        title="Sign Out"
        className="mb-6 mx-auto h-12 w-12 flex items-center justify-center rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-colors"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
      </button>
    </aside>
  );
}
