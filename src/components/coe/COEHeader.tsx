
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface COEHeaderProps {
  onCreateCOE: () => void;
}

const COEHeader = ({ onCreateCOE }: COEHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">COE Manager</h1>
      <Button onClick={onCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
        <Plus size={16} /> Create COE
      </Button>
    </div>
  );
};

export default COEHeader;
