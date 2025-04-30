
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionStepProps {
  description: string;
  onChange: (description: string) => void;
}

export function DescriptionStep({ description, onChange }: DescriptionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description" className="text-xl">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter screen description"
          className="bg-gray-950 border-gray-800 text-lg"
          rows={5}
        />
      </div>
    </div>
  );
}
