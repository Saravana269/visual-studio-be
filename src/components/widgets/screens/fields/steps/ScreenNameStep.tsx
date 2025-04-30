
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScreenNameStepProps {
  name: string;
  onChange: (name: string) => void;
}

export function ScreenNameStep({ name, onChange }: ScreenNameStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="screen-name" className="text-xl">Screen Name</Label>
        <Input
          id="screen-name"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter screen name"
          className="bg-gray-950 border-gray-800 text-lg"
        />
      </div>
    </div>
  );
}
