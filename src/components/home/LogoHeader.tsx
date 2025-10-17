
import React from "react";

const LogoHeader = () => {
  return (
    <div className="flex flex-col items-center mb-10">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src="/lovable-uploads/bffb888e-1eed-499e-aa66-2045b6c73f93.png" 
          alt="Business Transformation Hub Logo" 
          className="h-16 w-auto"
        />
      </div>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
        Empowering data-driven business transformation through actionable insights
      </p>
    </div>
  );
};

export default LogoHeader;
