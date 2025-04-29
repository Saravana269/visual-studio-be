
import { Button } from "@/components/ui/button";
import { ListFilter, LayoutGrid } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
      className="flex-shrink-0"
    >
      {viewMode === "grid" ? <LayoutGrid size={16} /> : <ListFilter size={16} />}
    </Button>
  );
}
