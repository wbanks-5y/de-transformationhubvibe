import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavIcons } from "./icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronUp, Home, MessageSquare } from "lucide-react";
import { useCockpitTypes } from "@/hooks/use-cockpit-data";
import { getIconByName } from "@/utils/iconUtils";
import { useAndroidOptimization } from "@/utils/androidWebViewDetection";
import AndroidBottomNavigation from "./AndroidBottomNavigation";

// Android-safe Cockpit Selector Modal Component
const AndroidCockpitModal = ({ isOpen, onClose, cockpitSubItems }: {
  isOpen: boolean;
  onClose: () => void;
  cockpitSubItems: any[];
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50" onClick={onClose}>
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[60vh] overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Select a Cockpit</h3>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]" style={{ WebkitOverflowScrolling: 'touch' }}>
          {cockpitSubItems.map((subItem) => {
            const SubIconComponent = subItem.icon;
            return (
              <Link
                key={subItem.name}
                to={subItem.href}
                className="flex items-center p-3 rounded-md hover:bg-gray-100 w-full active:bg-gray-200"
                onClick={onClose}
              >
                <SubIconComponent size={16} className="mr-2" />
                <span className="text-sm font-medium">{subItem.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Universal Simple Modal for all browsers
const SimpleCockpitModal = ({ isOpen, onClose, cockpitSubItems }: {
  isOpen: boolean;
  onClose: () => void;
  cockpitSubItems: any[];
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50" 
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[60vh] overflow-hidden"
        style={{ 
          position: 'fixed', 
          bottom: '64px', // Account for bottom nav height
          left: 0, 
          right: 0, 
          backgroundColor: 'white',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem',
          maxHeight: '60vh',
          overflow: 'hidden',
          zIndex: 9999
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b" style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 className="text-lg font-semibold" style={{ fontSize: '1.125rem', fontWeight: '600' }}>Select a Cockpit</h3>
        </div>
        <div 
          className="p-4 space-y-2 overflow-y-auto max-h-[50vh]" 
          style={{ 
            padding: '1rem', 
            maxHeight: '50vh', 
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {cockpitSubItems.map((subItem) => {
            const SubIconComponent = subItem.icon;
            return (
              <Link
                key={subItem.name}
                to={subItem.href}
                className="flex items-center p-3 rounded-md hover:bg-gray-100 w-full active:bg-gray-200"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  width: '100%',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <SubIconComponent size={16} className="mr-2" />
                <span className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {subItem.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const { data: cockpitTypes } = useCockpitTypes();
  const { shouldUseSimplified } = useAndroidOptimization();

  // If Android optimization is needed, use the simplified component
  if (shouldUseSimplified) {
    return <AndroidBottomNavigation />;
  }

  // Create cockpit navigation items from database data with dynamic icons
  const cockpitSubItems = cockpitTypes?.map(cockpit => {
    // Use the getIconByName helper to get the correct icon component
    const IconComponent = getIconByName(cockpit.icon);
    
    return {
      name: cockpit.display_name,
      href: cockpit.route_path,
      icon: IconComponent
    };
  }) || [];

  // Navigation items for mobile - Home, Cockpits, Myles, and Insights
  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    ...(cockpitSubItems.length > 0 ? [{
      name: "Cockpits", 
      href: "#", 
      icon: NavIcons.FinanceCockpit,
      subItems: cockpitSubItems
    }] : []),
    { name: "Myles", href: "/myles", icon: MessageSquare },
    { name: "Insights", href: "/insights", icon: NavIcons.Insights },
  ];

  const isActive = (path: string) => {
    if (path === "#") {
      // For Cockpits menu item, check if we're on any cockpit route
      return location.pathname.startsWith("/cockpit/");
    }
    return location.pathname === path || 
      (path !== "/" && location.pathname.startsWith(path));
  };

  const handleNavItemClick = (item: any) => {
    if (item.subItems) {
      setOpenDrawer(openDrawer === item.name ? null : item.name);
    } else {
      navigate(item.href);
      setOpenDrawer(null);
    }
  };

  return (
    <>
      {/* Bottom Navigation - Force show on mobile screens with no scroll */}
      <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 overflow-hidden touch-none">
        <div className={`grid h-16 ${navigationItems.length === 4 ? 'grid-cols-4' : `grid-cols-${navigationItems.length}`} overflow-hidden`}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item)}
                className={`flex flex-col items-center justify-center overflow-hidden touch-manipulation ${
                  isActive(item.href) 
                    ? "text-indigo-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center">
                  <IconComponent size={20} />
                </div>
                <span className="text-xs mt-1">{item.name}</span>
                {item.subItems && openDrawer === item.name && (
                  <ChevronUp className="h-3 w-3 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Universal Simple Modal for all browsers */}
      <SimpleCockpitModal
        isOpen={openDrawer === "Cockpits"}
        onClose={() => setOpenDrawer(null)}
        cockpitSubItems={cockpitSubItems}
      />

      {/* CSS to force show bottom navigation on small screens and prevent scrolling */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-bottom-nav {
            display: block !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            overflow: hidden !important;
            overscroll-behavior: none !important;
            -webkit-overflow-scrolling: none !important;
            touch-action: manipulation !important;
          }
          
          .mobile-bottom-nav * {
            overflow: hidden !important;
            overscroll-behavior: none !important;
            -webkit-overflow-scrolling: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default BottomNavigation;
