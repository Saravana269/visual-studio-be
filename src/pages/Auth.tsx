
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
