
import React, { useState, useEffect } from "react";
import { ConnectButton } from "./ConnectButton";
import { useCOEData } from "@/hooks/useCOEData";

interface COEManagerFrameworkProps {
  coeId: string | null | undefined;
  onConnect: (value: any, context?: string) => void;
}

export const COEManagerFramework = ({ coeId, onConnect }: COEManagerFrameworkProps) => {
  const { data: coes } = useCOEData();
  const [selectedCoe, setSelectedCoe] = useState<any>(null);
  
  // Find the selected COE from the list
  useEffect(() => {
    if (coeId && coes) {
      const coe = coes.find(c => c.id === coeId);
      if (coe) {
        setSelectedCoe(coe);
      }
    }
  }, [coeId, coes]);

  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">COE Configuration</h4>
      <div className="p-3 border border-gray-800 rounded-md">
        {coeId ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedCoe?.name || 'Selected COE'}</p>
                {selectedCoe?.description && (
                  <p className="text-sm text-gray-400">{selectedCoe.description}</p>
                )}
              </div>
              <ConnectButton value={coeId} context="coe_id" onConnect={onConnect} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">No class of elements selected</p>
        )}
      </div>
    </div>
  );
};
