
import React from "react";
import { ScreenConnection } from "@/types/connection";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionBadge } from "./ConnectionBadge";
import { FileTextIcon, BoxIcon, XIcon, ImageIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionCardProps {
  connection: ScreenConnection;
  onRemove: (connectionId: string) => Promise<void>;
}

export function ConnectionCard({ connection, onRemove }: ConnectionCardProps) {
  // Get the appropriate icon for a framework type
  const getFrameworkIcon = (frameworkType: string | null) => {
    switch(frameworkType) {
      case "Image Upload":
        return <ImageIcon size={16} className="text-[#00FF00]" />;
      case "COE Manager":
        return <BoxIcon size={16} className="text-[#00FF00]" />;
      default:
        return <FileTextIcon size={16} className="text-[#00FF00]" />;
    }
  };

  // Get display value for the source option based on property_values
  const getConnectionValue = (connection: ScreenConnection) => {
    // For Multiple Options or Radio Button frameworks, display the selected option from property_values
    if (connection.framework_type === "Multiple Options" || connection.framework_type === "Radio Button") {
      if (connection.property_values) {
        const propertyValues = connection.property_values as Record<string, any>;
        if (propertyValues.selectedOption) {
          return propertyValues.selectedOption;
        }
        if (propertyValues.selectedOptions && Array.isArray(propertyValues.selectedOptions)) {
          return propertyValues.selectedOptions.join(", ");
        }
      }
    }
    
    // Fallback to source_value for other frameworks
    return connection.source_value;
  };

  // Extract the source value from property_values or source_value
  const displayValue = getConnectionValue(connection);
  
  return (
    <Card className="bg-black border-gray-800 mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col w-full">
            <div className="flex items-center space-x-2">
              {getFrameworkIcon(connection.framework_type)}
              
              <span className="font-medium">
                This Screen
              </span>
              
              <ArrowRightIcon size={16} className="text-[#00FF00]" />
              
              <span className="font-medium">
                {connection.nextScreen_Name || "Connected Screen"}
              </span>
            </div>
            
            {connection.nextScreen_Description && (
              <div className="mt-1 text-sm text-gray-400">
                {connection.nextScreen_Description}
              </div>
            )}
            
            <div className="mt-2 space-x-2">
              {/* Source Screen Framework Type Badge */}
              {connection.framework_type && (
                <ConnectionBadge type="framework" label={connection.framework_type} />
              )}
              
              {/* Destination Screen Framework Type */}
              {connection.nextScreen_FrameworkType && (
                <ConnectionBadge type="screen" label={connection.nextScreen_FrameworkType} />
              )}

              {/* Display the selected value prominently if available */}
              {displayValue && (
                <ConnectionBadge type="value" label={displayValue} />
              )}
            </div>
          </div>
          
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(connection.id)}
            className="h-7 w-7 rounded-full hover:bg-red-500/10 hover:text-red-400 ml-2 flex-shrink-0"
          >
            <XIcon size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
