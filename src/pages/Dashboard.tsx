
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to elements page
    navigate("/elements");
  }, [navigate]);

  return null;
};

export default Dashboard;
