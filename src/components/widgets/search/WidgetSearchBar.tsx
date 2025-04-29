
import { ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WidgetSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function WidgetSearchBar({ searchQuery, setSearchQuery }: WidgetSearchBarProps) {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        placeholder="Search widgets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full"
      />
      <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
