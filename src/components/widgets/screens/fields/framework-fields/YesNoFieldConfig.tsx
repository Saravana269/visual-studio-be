
import React from "react";
import { Label } from "@/components/ui/label";

export function YesNoFieldConfig() {
  return (
    <div className="space-y-2">
      <Label>Default values are Yes/No</Label>
      <p className="text-sm text-gray-400">This framework type presents a simple Yes/No choice to the user.</p>
    </div>
  );
}
