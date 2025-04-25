
import { useState } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoeOption {
  id: string;
  name: string;
  description: string | null;
}

interface CoeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CoeSelector({ value, onChange }: CoeSelectorProps) {
  const [open, setOpen] = useState(false);
  
  // Fetch all COEs
  const { data: coes, isLoading } = useQuery({
    queryKey: ["coe-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("id, name, description")
        .order("name");
      
      if (error) throw error;
      return (data || []) as CoeOption[];
    }
  });
  
  // Fetch selected COE details to display names
  const { data: selectedCoes } = useQuery({
    queryKey: ["selected-coes", value],
    queryFn: async () => {
      if (!value || value.length === 0) return [];
      
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("id, name")
        .in("id", value);
      
      if (error) throw error;
      return (data || []).reduce((acc, coe) => {
        acc[coe.id] = coe.name;
        return acc;
      }, {} as Record<string, string>);
    },
    enabled: value.length > 0
  });
  
  const toggleCoe = (coeId: string) => {
    onChange(
      value.includes(coeId)
        ? value.filter(id => id !== coeId)
        : [...value, coeId]
    );
  };
  
  const handleRemoveCoe = (e: React.MouseEvent, coeId: string) => {
    e.stopPropagation();
    onChange(value.filter(id => id !== coeId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0 
              ? `${value.length} COE${value.length !== 1 ? 's' : ''} selected`
              : "Select COEs..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search COEs..." icon={Search} />
            {isLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground mt-2">Loading COEs...</p>
              </div>
            ) : (
              <>
                <CommandEmpty>No COEs found.</CommandEmpty>
                <CommandList>
                  <ScrollArea className="h-64">
                    <CommandGroup>
                      {coes?.map((coe) => (
                        <CommandItem
                          key={coe.id}
                          value={coe.name}
                          onSelect={() => toggleCoe(coe.id)}
                          className="flex items-center gap-2"
                        >
                          <div 
                            className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-sm border ${
                              value.includes(coe.id) ? "bg-primary border-primary" : "border-primary"
                            }`}
                          >
                            {value.includes(coe.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{coe.name}</p>
                            {coe.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{coe.description}</p>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      
      {value.length > 0 && selectedCoes && (
        <div className="flex flex-wrap gap-2">
          {value.map(coeId => (
            <Badge key={coeId} variant="secondary" className="gap-1 pr-1">
              {selectedCoes[coeId] || "Loading..."}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleRemoveCoe(e, coeId)}
                className="h-4 w-4 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
