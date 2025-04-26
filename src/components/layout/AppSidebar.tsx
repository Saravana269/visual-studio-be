import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarSeparator } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tag, Database, Link, Layout, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { title: "Element Manager", path: "/elements", icon: Tag },
    { title: "COE Manager", path: "/coes", icon: Database },
    { title: "Core Set Manager", path: "/core-sets", icon: Link },
    { title: "Widget Manager", path: "/widgets", icon: Layout },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
    <Sidebar className="bg-[#0D1117] text-white min-h-screen flex flex-col">
      <SidebarContent>
        <div className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.path} className="flex justify-center">
              <SidebarMenuButton
                tooltip={item.title}
                data-active={isActive(item.path)}
                onClick={() => navigate(item.path)}
                className="p-3 rounded-md hover:bg-[#161B22] flex items-center justify-center transition-all duration-200
                  data-[active=true]:bg-[#161B22] 
                  data-[active=true]:text-[#1ABC9C]"
              >
                <item.icon size={24} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto mb-4">
        <SidebarSeparator />
        <div className="flex justify-center p-2">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-[#161B22] text-gray-400 hover:text-white"
          >
            <LogOut size={24} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
