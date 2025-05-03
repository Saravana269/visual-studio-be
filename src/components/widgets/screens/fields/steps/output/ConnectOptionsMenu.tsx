
import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, FileText, Link, X } from "lucide-react";

interface ConnectOptionsMenuProps {
  trigger: React.ReactNode;
  onOptionSelect: (option: string) => void;
  widgetId?: string;
}

export const ConnectOptionsMenu = ({ trigger, onOptionSelect, widgetId }: ConnectOptionsMenuProps) => {
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

  return (
    <Popover>
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
              onClick={() => onOptionSelect(option.id)}
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
};
