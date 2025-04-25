
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const CoreSetManager = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Coming soon",
      description: "The Core Set Manager is currently under development.",
    });
  }, [toast]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Core Set Manager</h1>
      <div className="bg-muted p-8 rounded-md text-center">
        <h2 className="text-xl font-medium text-muted-foreground">
          This feature is coming soon
        </h2>
        <p className="mt-2 text-muted-foreground">
          The Core Set Manager is currently under development and will be available soon.
        </p>
      </div>
    </div>
  );
};

export default CoreSetManager;
