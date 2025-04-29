
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TagSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TagSearch({ value, onChange }: TagSearchProps) {
  return (
    <div className="relative min-w-[180px] max-w-[240px] flex-shrink-0">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search tags..." 
        className="pl-9" 
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
