
import React from "react";
import { Routes, Route } from "react-router-dom";
import OptimizedHomeScreen from "../components/OptimizedHomeScreen";
import { useScrollTop } from "@/hooks/useScrollTop";

const Index = () => {
  useScrollTop(); // Ensure page scrolls to top on route change
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<OptimizedHomeScreen />} />
      </Routes>
    </div>
  );
};

export default Index;
