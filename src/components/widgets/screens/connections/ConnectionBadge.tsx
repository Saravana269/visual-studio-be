import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionBadgeProps {
  type: "framework" | "screen" | "value" | "option";
  label: string;
  // Support for existing components that use connectionId prop
  connectionId?: string;
  onViewConnection?: () => void;
  className?: string;
}

export function ConnectionBadge({ 
  type, 
  label, 
  connectionId, 
  onViewConnection,
  className = ""
}: ConnectionBadgeProps) {
  const getBadgeStyles = () => {
    switch (type) {
      case "framework":
        return "bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/30";
      case "screen":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "value":
        return "bg-green-500/30 text-green-300 border-green-500/40 font-medium";
      case "option":
        return "bg-blue-500/30 text-blue-300 border-blue-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // If we have a connectionId and viewConnection function, render badge with button
  if (connectionId && onViewConnection) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Badge variant="outline" className={`${getBadgeStyles()} mr-1`}>
          {typeof label === 'string' && label.length > 20 
            ? `${label.substring(0, 20)}...` 
            : label}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 rounded-full hover:bg-blue-500/10"
          onClick={onViewConnection}
        >
          <Eye size={12} className="text-blue-400" />
        </Button>
      </div>
    );
  }

  // Otherwise, just render the badge
  return (
    <Badge variant="outline" className={`${getBadgeStyles()} ${className}`}>
      {typeof label === 'string' && label.length > 20 
        ? `${label.substring(0, 20)}...` 
        : label}
    </Badge>
  );
}
