
import React from "react";
import { Screen } from "@/types/screen";
import { Skeleton } from "@/components/ui/skeleton";

interface CurrentScreenInfoProps {
  currentScreen: Screen | null;
  isLoading?: boolean;
}

export function CurrentScreenInfo({ currentScreen, isLoading = false }: CurrentScreenInfoProps) {
  if (isLoading) {
    return (
      <div className="bg-black rounded-md p-4">
        <h3 className="text-sm font-medium text-white mb-2">Current Screen</h3>
        <Skeleton className="h-5 w-32 bg-gray-800 mb-1" />
        <Skeleton className="h-4 w-24 bg-gray-800 mb-2" />
        <Skeleton className="h-4 w-48 bg-gray-800" />
      </div>
    );
  }

  if (!currentScreen) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
        <h3 className="text-sm font-medium text-red-400 mb-2">Current Screen Not Available</h3>
        <p className="text-xs text-gray-400 mb-2">Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-md p-4">
      <h3 className="text-sm font-medium text-white mb-2">Current Screen</h3>
      <p className="text-sm font-bold text-white mb-1">{currentScreen?.name || "Untitled Screen"}</p>
      <p className="text-xs text-gray-400 mb-2">{currentScreen?.framework_type || "No framework"}</p>
      <p className="text-xs text-gray-500">{currentScreen?.description || "No description"}</p>
    </div>
  );
}
