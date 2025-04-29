
import { WidgetSearchBar } from "./WidgetSearchBar";
import { ViewToggle } from "./ViewToggle";

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <WidgetSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
}
