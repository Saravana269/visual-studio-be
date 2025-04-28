
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface COEHeaderProps {
  onCreateCOE: () => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

const COEHeader = ({ onCreateCOE, viewMode, setViewMode }: COEHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">COE Manager</h1>
      <div className="flex items-center gap-4">
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="rounded-none border-0"
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
            className="rounded-none border-0"
          >
            <List size={18} />
          </Button>
        </div>
        <Button onClick={onCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
          <Plus size={16} /> Create COE
        </Button>
      </div>
    </div>
  );
};

export default COEHeader;
