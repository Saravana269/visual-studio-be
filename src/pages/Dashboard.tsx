
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, List, Tag } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const managementModules = [
    {
      title: "Element Manager",
      description: "Manage atomic elements with properties and COE mappings",
      icon: <Tag className="h-5 w-5" />,
      path: "/elements",
    },
    {
      title: "COE Manager",
      description: "Manage Classes of Elements and their relationships",
      icon: <List className="h-5 w-5" />,
      path: "/coes",
    },
    {
      title: "Core Set Manager",
      description: "Create and manage Core Sets for element mappings",
      icon: <FileText className="h-5 w-5" />,
      path: "/core-sets",
    },
    // Additional modules can be added here
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementModules.map((module) => (
          <Card key={module.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {module.icon}
                {module.title}
              </CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate(module.path)}
                disabled={module.path !== "/elements"}
              >
                {module.path === "/elements" ? "Open" : "Coming Soon"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
