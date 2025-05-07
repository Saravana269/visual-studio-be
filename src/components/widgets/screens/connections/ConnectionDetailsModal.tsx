
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Screen } from "@/types/screen";

interface ConnectionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string | null;
}

export function ConnectionDetailsModal({
  isOpen,
  onClose,
  connectionId
}: ConnectionDetailsModalProps) {
  const { toast } = useToast();
  const [targetScreen, setTargetScreen] = useState<Screen | null>(null);

  // Fetch the connection details
  const { data: connection, isLoading } = useQuery({
    queryKey: ['connection-details', connectionId],
    queryFn: async () => {
      if (!connectionId) return null;
      
      try {
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('id', connectionId)
          .single();
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error fetching connection details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch connection details",
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!connectionId && isOpen
  });

  // Fetch the target screen details when we have a connection
  useEffect(() => {
    if (connection?.nextScreen_Ref) {
      const fetchTargetScreen = async () => {
        try {
          const { data, error } = await supabase
            .from('screens')
            .select('*')
            .eq('id', connection.nextScreen_Ref)
            .single();
            
          if (error) throw error;
          
          setTargetScreen(data);
        } catch (error) {
          console.error("Error fetching target screen:", error);
          setTargetScreen(null);
        }
      };
      
      fetchTargetScreen();
    }
  }, [connection]);

  // Get display value for the source option based on property_values
  const getConnectionSourceValue = () => {
    if (!connection) return null;
    
    // For Multiple Options or Radio Button frameworks
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

  // Handle removing the connection
  const handleRemoveConnection = async () => {
    if (!connectionId) return;
    
    try {
      const { error } = await supabase
        .from('connect_screens')
        .update({ is_screen_terminated: true })
        .eq('id', connectionId);
        
      if (error) throw error;
      
      toast({
        title: "Connection removed",
        description: "The connection has been successfully terminated",
      });
      
      onClose();
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: "Error",
        description: "Failed to terminate connection",
        variant: "destructive"
      });
    }
  };

  const sourceValue = getConnectionSourceValue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg">Connection Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="p-4">Loading connection details...</div>
        ) : connection ? (
          <div className="space-y-4">
            <div className="border border-gray-800 rounded-md p-4 bg-black/20">
              <h3 className="text-sm font-medium text-gray-200 mb-3">Source Option:</h3>
              <div className="text-[#00FF00] bg-[#00FF00]/10 p-2 rounded border border-[#00FF00]/20">
                {sourceValue || "No source value available"}
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-md p-4 bg-black/20">
              <h3 className="text-sm font-medium text-gray-200 mb-3">Connected To Screen:</h3>
              {targetScreen ? (
                <div className="space-y-2">
                  <p className="font-medium">{targetScreen.name}</p>
                  {targetScreen.description && (
                    <p className="text-sm text-gray-400">{targetScreen.description}</p>
                  )}
                  {targetScreen.framework_type && (
                    <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30">
                      {targetScreen.framework_type}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Target screen information not available</p>
              )}
            </div>
            
            <div className="border border-gray-800 rounded-md p-4 bg-black/20">
              <h3 className="text-sm font-medium text-gray-200 mb-3">Connection Context:</h3>
              <p>{connection.connection_context || "No specific context"}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 text-gray-400">No connection details available</div>
        )}
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700"
          >
            Close
          </Button>
          <Button 
            onClick={handleRemoveConnection}
            className="bg-red-900/50 text-red-400 hover:bg-red-900/80 border border-red-900/50"
          >
            Remove Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
