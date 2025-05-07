
import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, FileText, Link, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useConnectionDialogs } from "@/context/ConnectionDialogContext";
import { ConnectionValueContext } from "@/types/connection";

interface ConnectOptionsMenuProps {
  trigger: React.ReactNode;
  onOptionSelect: (option: string) => void;
  widgetId?: string;
  screenId?: string; // Add screenId prop
}

export const ConnectOptionsMenu = ({ trigger, onOptionSelect, widgetId, screenId }: ConnectOptionsMenuProps) => {
  const location = useLocation();
  const { openExistingScreenDialog } = useConnectionDialogs();
  
  // Determine if we're on the elements page
  const isOnElementsPage = location.pathname.includes('/elements');
  
  console.log("🔄 ConnectOptionsMenu rendered with widgetId:", widgetId, "screenId:", screenId, "on path:", location.pathname);

  const [open, setOpen] = React.useState(false);

  const menuOptions = [
    {
      id: "new_screen",
      icon: <Plus size={16} className="text-[#00FF00]" />,
      label: "New Screen",
      subtext: "Create and link a new screen within this widget"
    },
    {
      id: "existing_screen",
      icon: <FileText size={16} className="text-[#00FF00]" />,
      label: "Existing Screen",
      subtext: "Select a screen from this widget to connect"
    },
    {
      id: "connect_widget",
      icon: <Link size={16} className="text-[#00FF00]" />,
      label: "Connect Other Widget",
      subtext: "Link to a screen in a different widget"
    },
    {
      id: "terminate",
      icon: <X size={16} className="text-red-500" />,
      label: "Terminate",
      subtext: "Remove the connection and reset flow"
    }
  ];

  // Handle menu option selection with special handling for elements page
  const handleMenuItemClick = (option: string, event: React.MouseEvent<HTMLDivElement>) => {
    console.log("🔘 Menu option clicked:", option, "widgetId:", widgetId, "screenId:", screenId, "path:", location.pathname);
    
    // Close the menu immediately
    setOpen(false);
    
    // Special handling for "existing_screen" when we're on elements page
    if (option === "existing_screen" && isOnElementsPage) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log("🌍 Using global dialog for existing screen on elements page with screenId:", screenId);
      // Use screenId directly from props if available (helps ensure we have the current screen context)
      if (screenId) {
        // Store current screen ID in localStorage for the connection dialogs
        try {
          localStorage.setItem('current_screen_id', screenId);
          console.log("📌 Stored current_screen_id in localStorage:", screenId);
        } catch (e) {
          console.error("Error storing current screen ID:", e);
        }
      }
      
      // Create connection context object for the openExistingScreenDialog
      const connectionContext: ConnectionValueContext = {
        value: null,
        context: "imageUpload",
        widgetId,
        screenId
      };
      
      // Pass the connection context to openExistingScreenDialog
      openExistingScreenDialog(connectionContext);
    } 
    // Special handling for "existing_screen" on the screens page - use the panel layout
    else if (option === "existing_screen" && !isOnElementsPage) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log("🌍 Using panel layout for existing screen on screens page with screenId:", screenId);
      
      // Store current screen ID in localStorage if available
      if (screenId) {
        try {
          localStorage.setItem('current_screen_id', screenId);
          console.log("📌 Stored current_screen_id in localStorage:", screenId);
        } catch (e) {
          console.error("Error storing current screen ID:", e);
        }
      }
      
      // Dispatch a custom event with connection mode detail
      const customEvent = new CustomEvent('openConnectionPanel', { 
        detail: { connectionMode: "existingScreen", screenId: screenId } 
      });
      window.dispatchEvent(customEvent);
    }
    else {
      // Normal handling - call the provided onOptionSelect function
      onOptionSelect(option);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={5}
        className="w-72 p-0 bg-black border border-gray-800 rounded-lg shadow-lg"
      >
        <div className="py-2">
          {menuOptions.map((option) => (
            <div
              key={option.id}
              onClick={(e) => handleMenuItemClick(option.id, e)}
              className="px-4 py-3 cursor-pointer hover:bg-[#00FF00]/10 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex-shrink-0">
                  {option.icon}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm text-white">{option.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{option.subtext}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
