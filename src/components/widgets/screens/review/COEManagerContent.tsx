
import { useCOEData } from "@/hooks/useCOEData";
import { useCOEElements } from "@/hooks/useCOEElements";
import { useState, useEffect } from "react";
import { COEElementsList } from "./COEElementsList";

interface COEManagerContentProps {
  metadata: Record<string, any>;
}

export function COEManagerContent({ metadata }: COEManagerContentProps) {
  const { data: coes = [] } = useCOEData();
  const [selectedCoe, setSelectedCoe] = useState<any>(null);
  const { data: coeElements = [], isLoading: isLoadingElements } = useCOEElements(metadata.coe_id);
  
  useEffect(() => {
    if (metadata.coe_id && coes.length > 0) {
      const coe = coes.find((coe) => coe.id === metadata.coe_id);
      if (coe) {
        setSelectedCoe(coe);
      }
    }
  }, [metadata.coe_id, coes]);

  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium text-gray-400 mb-2">Class of Elements:</h4>
      <div className="p-3 border border-[#00FF00]/20 rounded bg-black/30">
        <div>
          {selectedCoe ? (
            <div className="space-y-3">
              <div>
                <p className="text-gray-200 text-sm font-medium">{selectedCoe.name}</p>
                {selectedCoe.description && (
                  <p className="text-gray-400 text-xs mt-1">{selectedCoe.description}</p>
                )}
              </div>
              <COEElementsList elements={coeElements} isLoading={isLoadingElements} />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              {metadata.coe_id ? "COE selected" : "No class of elements selected"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
