
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  
  // Sign out function for the sidebar
  const handleSignOut = () => {
    // Implement your sign out logic here
    navigate("/auth");
  };
  
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar onSignOut={handleSignOut} />
      <div className="flex-1 overflow-auto ml-[60px]">
        {children}
      </div>
    </div>
  );
}
