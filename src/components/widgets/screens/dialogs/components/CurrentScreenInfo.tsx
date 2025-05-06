
import React from "react";
import { Screen } from "@/types/screen";

interface CurrentScreenInfoProps {
  currentScreen: Screen | null;
}

export function CurrentScreenInfo({ currentScreen }: CurrentScreenInfoProps) {
  return (
    <div className="bg-black rounded-md p-4">
      <h3 className="text-sm font-medium text-white mb-2">Current Screen</h3>
      <p className="text-sm font-bold text-white mb-1">{currentScreen?.name || "Untitled Screen"}</p>
      <p className="text-xs text-gray-400 mb-2">{currentScreen?.framework_type || "No framework"}</p>
      <p className="text-xs text-gray-500">{currentScreen?.description || "No description"}</p>
    </div>
  );
}
