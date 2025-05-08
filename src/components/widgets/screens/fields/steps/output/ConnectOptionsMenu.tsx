
import React, { useState, useEffect } from "react";
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
  screenId?: string;
}

export const ConnectOptionsMenu = ({ trigger, onOptionSelect, widgetId, screenId }: ConnectOptionsMenuProps) => {
  const location = useLocation();
  const { openExistingScreenDialog } = useConnectionDialogs();
  const [isChoosePanelVisible, setIsChoosePanelVisible] = useState(false);
  
  // Determine if we're on the screens page
  const isOnScreensPage = location.pathname.includes('/screens');
  
  console.log("🔄 ConnectOptionsMenu rendered with widgetId:", widgetId, "screenId:", screenId, "on path:", location.pathname);

  const [open, setOpen] = useState(false);

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

  // Handle menu option selection with special handling for choosing an existing screen
  const handleMenuItemClick = (option: string, event: React.MouseEvent<HTMLDivElement>) => {
    console.log("🔘 Menu option clicked:", option, "widgetId:", widgetId, "screenId:", screenId);
    
    // Close the menu immediately
    setOpen(false);
    
    // Special handling for "existing_screen" option
    if (option === "existing_screen") {
      event.preventDefault();
      event.stopPropagation();
      
      console.log("🌍 Opening connection panel for existing screen with screenId:", screenId);
      
      // Store current screen ID in localStorage for the connection dialogs
      if (screenId) {
        try {
          localStorage.setItem('current_screen_id', screenId);
          console.log("📌 Stored current_screen_id in localStorage:", screenId);
        } catch (e) {
          console.error("Error storing current screen ID:", e);
        }
      }
      
      // Create connection context object
      const connectionContext: ConnectionValueContext = {
        value: null,
        context: "Multiple Options",
        widgetId,
        screenId
      };
      
      // Open the existing screen dialog using the global context
      openExistingScreenDialog(connectionContext);
      
      // Dispatch custom event to open the choose screen panel
      const customEvent = new CustomEvent('openConnectionPanel', { 
        detail: { connectionMode: "existingScreen", screenId: screenId } 
      });
      window.dispatchEvent(customEvent);
    } 
    else {
      // Normal handling for other options - call the onOptionSelect function
      onOptionSelect(option);
    }
  };

  useEffect(() => {
    // Listen for the event that indicates the connection was made
    const handleConnectionEstablished = () => {
      console.log("✅ Connection established, hiding connect button");
      // You would implement logic here to hide the connect button if needed
    };
    
    window.addEventListener('connectionEstablished', handleConnectionEstablished);
    
    return () => {
      window.removeEventListener('connectionEstablished', handleConnectionEstablished);
    };
  }, []);

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
