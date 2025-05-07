
import React from "react";
import { ScreenConnection } from "@/types/connection";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileTextIcon, BoxIcon, XIcon, ImageIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionBadge } from "./ConnectionBadge";

interface ActiveConnectionsProps {
  screenId?: string;
  elementId?: string;
  widgetId?: string;
}

export function ActiveConnections({ screenId, elementId, widgetId }: ActiveConnectionsProps) {
  const { toast } = useToast();
  const { connections, isLoading, refetchConnections } = useScreenConnections({
    screenId,
    elementId,
    widgetId,
    enabled: !!(screenId || elementId || widgetId)
  });

  // Handle removing a connection
  const handleRemoveConnection = async (connectionId: string) => {
    try {
      // Update the connection to mark it as terminated
      const { error } = await supabase
        .from('connect_screens')
        .update({ is_screen_terminated: true })
        .eq('id', connectionId);
        
      if (error) {
        console.error("Error removing connection:", error);
        toast({
          title: "Error",
          description: "Failed to remove connection",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Connection Removed",
        description: "The connection has been terminated",
      });
      
      // Refresh the connections list
      refetchConnections();
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive"
      });
    }
  };

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

  // Filter connections to only show outgoing connections from the current screen
  // This means only showing connections where the current screen is the source
  const relevantConnections = connections.filter(conn => 
    !conn.is_screen_terminated && conn.screen_ref === screenId
  );

  // Connection card component
  const ConnectionCard = ({ connection }: { connection: ScreenConnection }) => {
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
                  <Badge variant="outline" className="bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/30">
                    {connection.framework_type}
                  </Badge>
                )}
                
                {/* Destination Screen Framework Type */}
                {connection.connection_context && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {connection.connection_context?.split(':')?.[1] || connection.connection_context}
                  </Badge>
                )}

                {connection.source_value && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {typeof connection.source_value === 'string' && connection.source_value.length > 20 
                      ? `${connection.source_value.substring(0, 20)}...` 
                      : connection.source_value}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => handleRemoveConnection(connection.id)}
              className="h-7 w-7 rounded-full hover:bg-red-500/10 hover:text-red-400 ml-2 flex-shrink-0"
            >
              <XIcon size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-800" />
        <Skeleton className="h-24 w-full bg-gray-800" />
        <Skeleton className="h-24 w-full bg-gray-800" />
      </div>
    );
  }

  if (relevantConnections.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-gray-800 rounded-md">
        <p className="text-gray-400 text-sm">No outgoing connections from this screen</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {relevantConnections.map((connection) => (
        <ConnectionCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}
