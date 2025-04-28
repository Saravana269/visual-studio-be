
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface AuthFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

export const AuthForm = ({ isLoading, setIsLoading, onSuccess }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authProgress, setAuthProgress] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAuthProgress(10);

    try {
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      setAuthProgress(30);

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth/callback"
          }
        });
        
        if (error) throw error;
        
        setAuthProgress(100);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
      } else {
        setAuthProgress(50);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setAuthProgress(100);
        toast({
          title: "Sign in successful",
          description: "Welcome back!",
        });
        onSuccess();
      }
    } catch (error: any) {
      setAuthProgress(0);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="bg-background"
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="bg-background"
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
      </div>
      
      {isLoading && <Progress value={authProgress} className="h-2" />}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? "Creating account..." : "Signing in..."}
          </>
        ) : (
          isSignUp ? "Sign Up" : "Sign In"
        )}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-sm text-primary hover:underline"
          disabled={isLoading}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </form>
  );
};
