
import React from "react";
import { Screen } from "@/types/screen";

interface CurrentScreenInfoProps {
  currentScreen: Screen | null;
}

export function CurrentScreenInfo({ currentScreen }: CurrentScreenInfoProps) {
  return (
    <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
      <h3 className="text-sm font-medium text-gray-200 mb-2">Current Screen</h3>
      <p className="text-sm font-bold mb-1">{currentScreen?.name || "Untitled Screen"}</p>
      <p className="text-xs text-gray-400">{currentScreen?.description || "No description"}</p>
    </div>
  );
}
