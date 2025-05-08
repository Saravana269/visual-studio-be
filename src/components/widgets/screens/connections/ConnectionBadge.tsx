
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ConnectionBadgeProps {
  type: "framework" | "screen" | "value" | "option";
  label: string;
}

export function ConnectionBadge({ type, label }: ConnectionBadgeProps) {
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

  return (
    <Badge variant="outline" className={getBadgeStyles()}>
      {typeof label === 'string' && label.length > 20 
        ? `${label.substring(0, 20)}...` 
        : label}
    </Badge>
  );
}
