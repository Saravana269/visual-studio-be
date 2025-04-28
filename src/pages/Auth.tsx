
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for existing session on page load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is already authenticated, redirect to dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        // Regardless of outcome, we're done initializing
        setIsInitializing(false);
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Progress value={40} className="h-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to VS BE</h1>
          <p className="text-muted-foreground">Sign in or create an account to continue</p>
        </div>
        <AuthForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSuccess={() => {
            toast({
              title: "Success",
              description: "Successfully authenticated",
            });
            navigate("/dashboard");
          }}
        />
      </div>
    </div>
  );
};

export default Auth;
