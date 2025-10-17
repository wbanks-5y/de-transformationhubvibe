
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft } from "lucide-react";

type BackButtonProps = {
  className?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // If we're on the home page, don't show the back button
  if (isHomePage) {
    return null;
  }

  // If we're on a top-level route, go home
  // If we're on a nested route, go back one level
  const handleClick = () => {
    if (location.pathname.split("/").length > 2) {
      // We're on a nested route like /procurement/123
      navigate(-1);
    } else {
      // We're on a top-level route like /procurement
      navigate("/");
    }
  };

  const isNestedRoute = location.pathname.split("/").filter(Boolean).length > 1;
  const buttonText = isNestedRoute ? "Back" : "Home";
  const ButtonIcon = isNestedRoute ? ChevronLeft : Home;

  return (
    <Button 
      variant="ghost" 
      className={`mb-4 ${className}`} 
      onClick={handleClick}
    >
      <ButtonIcon className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default BackButton;
