
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator
} from "@/components/ui/sidebar";
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
      if (error) {
        throw error;
      }
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
    <Sidebar className="bg-[#1A1F2C] text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-4 text-lg font-semibold">
            App Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    data-active={isActive(item.path)} 
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                    className="hover:bg-[#2A2F3C] data-[active=true]:bg-[#2A2F3C] data-[active=true]:text-[#0FA0CE]"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 text-white hover:bg-[#2A2F3C] hover:text-white" 
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
