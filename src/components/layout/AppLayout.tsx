
import { ReactNode } from 'react';
import Navbar from "../navigation/Navbar";
import BottomNavigation from "../navigation/BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

// Layout component to wrap protected routes with consistent navigation
const AppLayout = ({ children }: LayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow pb-16 md:pb-0">
      {children}
    </div>
    <BottomNavigation />
  </div>
);

export default AppLayout;
