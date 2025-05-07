
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
    </div>
  );
}
