
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionBadge } from "../connections/ConnectionBadge";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface InformationContentProps {
  metadata: Record<string, any>;
  onConnect?: (text: string) => void;
  screenId?: string;
}

export function InformationContent({ metadata, onConnect, screenId }: InformationContentProps) {
  const text = metadata.text || "No information text provided.";
  
  // Use the custom hook to check for existing Information framework connections
  const { connections, isFrameworkConnected } = useOptionConnections(screenId, "Information");
  
  // Check if this specific text content is already connected
  const hasExistingConnection = connections.some(conn => 
    conn.screen_ref === screenId &&
    conn.framework_type === "Information" && 
    !conn.is_screen_terminated &&
    conn.source_value === text
  );

  // Find the connection for displaying the badge
  const existingConnection = connections.find(conn => 
    conn.screen_ref === screenId &&
    conn.framework_type === "Information" && 
    !conn.is_screen_terminated &&
    conn.source_value === text
  );
  
  console.log("Information content:", {
    hasExistingConnection,
    connections,
    screenId,
    text
  });
  
  return (
    <div className="mt-4 border border-[#00FF00]/20 rounded bg-black/30">
      <div className="p-2">
        <ScrollArea className="h-[180px] w-full">
          <div className="pr-3">
            <div className="flex justify-between items-start">
              <p className="text-gray-300 whitespace-pre-wrap text-sm">{text}</p>
              
              {hasExistingConnection && existingConnection && (
                <ConnectionBadge
                  connectionId={existingConnection.id}
                  className="ml-2 mt-1 flex-shrink-0"
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Add the connected status badge at the bottom when a connection exists */}
      {hasExistingConnection && existingConnection && (
        <div className="flex justify-center py-2 border-t border-[#00FF00]/20">
          <div className="bg-[#00FF00]/20 text-[#00FF00] px-4 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Connected
          </div>
        </div>
      )}
    </div>
  );
}
