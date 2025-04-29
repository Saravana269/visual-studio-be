
import { Badge } from "@/components/ui/badge";
import type { COE } from "@/hooks/useCOEData";

interface COEDetailHeaderProps {
  coe: COE;
  tagDetail?: { id: string; label: string } | null;
}

export const COEDetailHeader = ({ coe, tagDetail }: COEDetailHeaderProps) => {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{coe.name}</h1>
          {coe.description && (
            <p className="text-muted-foreground">{coe.description}</p>
          )}
        </div>
        {coe.image_url && (
          <img 
            src={coe.image_url} 
            alt={coe.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Primary Tag Section */}
      {tagDetail && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Primary Tag</h3>
          <Badge variant="secondary" className="bg-blue-100">
            {tagDetail.label}
          </Badge>
        </div>
      )}

      {/* Additional Tags Section */}
      {coe.tags && coe.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Additional Tags</h3>
          <div className="flex flex-wrap gap-2">
            {coe.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
