
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ConnectionsLoading() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full bg-gray-800" />
      <Skeleton className="h-24 w-full bg-gray-800" />
      <Skeleton className="h-24 w-full bg-gray-800" />
    </div>
  );
}
