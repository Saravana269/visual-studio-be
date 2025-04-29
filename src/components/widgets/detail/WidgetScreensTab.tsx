
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Screen } from "@/types/widget";
import { useNavigate } from "react-router-dom";

interface WidgetScreensTabProps {
  screens: Screen[];
  widgetId: string;
  onClose: () => void;
}

export function WidgetScreensTab({ screens, widgetId, onClose }: WidgetScreensTabProps) {
  const navigate = useNavigate();
  
  const handleManageScreens = () => {
    onClose();
    navigate(`/widgets/${widgetId}/screens`);
  };

  return (
    <>
      {screens.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screens.map((screen) => (
                <TableRow key={screen.id}>
                  <TableCell className="font-medium">{screen.name}</TableCell>
                  <TableCell>{screen.framework_type || "Not specified"}</TableCell>
                  <TableCell>{screen.description || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No screens have been added to this widget yet.</p>
        </div>
      )}
      {/* Navigate directly to screen manager */}
      <div className="mt-4 flex justify-end">
        <Button 
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          onClick={handleManageScreens}
        >
          {screens.length > 0 ? "Manage Screens" : "Add Screens"}
        </Button>
      </div>
    </>
  );
}
