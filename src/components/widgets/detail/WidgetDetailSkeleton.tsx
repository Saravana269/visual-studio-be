
import { Skeleton } from "@/components/ui/skeleton";

export function WidgetDetailSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
