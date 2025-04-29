
import { Badge } from "@/components/ui/badge";
import type { CoreSet } from "@/hooks/useCoreSetData";

interface CoreSetDetailHeaderProps {
  coreSet: CoreSet;
}

export const CoreSetDetailHeader = ({ coreSet }: CoreSetDetailHeaderProps) => {
  if (!coreSet) return null;
  
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{coreSet.name}</h1>
          {coreSet.description && (
            <p className="text-muted-foreground">{coreSet.description}</p>
          )}
        </div>
        {coreSet.image_url && (
          <img 
            src={coreSet.image_url} 
            alt={coreSet.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Tags Section */}
      {coreSet.tags && coreSet.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {coreSet.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Connection Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coreSet.source_coe_id && (
          <div className="space-y-2">
            <h3 className="text-md font-semibold">Source COE</h3>
            <Badge variant="outline" className="bg-blue-900/20">
              {coreSet.source_coe_id}
            </Badge>
          </div>
        )}
        
        {coreSet.destination_coe_id && (
          <div className="space-y-2">
            <h3 className="text-md font-semibold">Destination COE</h3>
            <Badge variant="outline" className="bg-green-900/20">
              {coreSet.destination_coe_id}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
