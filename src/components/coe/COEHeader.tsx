
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface COEHeaderProps {
  onCreateCOE: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const COEHeader = ({ onCreateCOE, searchQuery, setSearchQuery }: COEHeaderProps) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search COEs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button onClick={onCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
        <Plus size={16} /> Create COE
      </Button>
    </div>
  );
};

export default COEHeader;
