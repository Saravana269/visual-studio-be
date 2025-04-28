
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface COEEmptyStateProps {
  onCreateFirst: () => void;
}

const COEEmptyState = ({ onCreateFirst }: COEEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Plus className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">No Classes of Elements Yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create your first Class of Elements to start organizing your elements into meaningful categories.
      </p>
      
      <Button onClick={onCreateFirst} className="animate-pulse hover:animate-none">
        <Plus className="mr-2 h-4 w-4" />
        Create First COE
      </Button>
    </div>
  );
};

export default COEEmptyState;
