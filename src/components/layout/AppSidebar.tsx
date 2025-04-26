
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tag, Layers, Link, Layout, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { title: "Element Manager", path: "/elements", icon: Tag },
    { title: "COE Manager", path: "/coe", icon: Layers },
    { title: "Core Set Manager", path: "/core-set", icon: Link },
    { title: "Widget Manager", path: "/widgets", icon: Layout },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="bg-[#0D1117] text-white w-[70px] min-h-screen flex flex-col items-center fixed left-0 top-0 z-50">
      <div className="flex flex-col gap-4 mt-6">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            data-active={isActive(item.path)}
            onClick={() => navigate(item.path)}
            variant="ghost"
            className="p-3 rounded-md hover:bg-[#161B22] flex items-center justify-center transition-all duration-200
              data-[active=true]:bg-[#161B22]
              data-[active=true]:text-[#1ABC9C]"
          >
            <item.icon size={24} />
            <span className="absolute left-16 bg-[#161B22] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              {item.title}
            </span>
          </Button>
        ))}
      </div>

      <div className="mt-auto mb-4">
        <hr className="border-[#222] w-8 mx-auto my-4" />
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-[#161B22] text-gray-400 hover:text-white"
        >
          <LogOut size={24} />
        </Button>
      </div>
    </aside>
  );
}
