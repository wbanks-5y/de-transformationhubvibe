
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCachedAdminCheck } from "@/hooks/auth/use-cached-admin-check";
import { NavIcons } from "./icons";
import NavigationItems from "./NavigationItems";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import { NavigationItem, NavigationSubItem } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCockpitTypes } from "@/hooks/cockpit/use-cockpit-types";
import { getIconByName } from "@/utils/iconUtils";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { data: cockpitTypes } = useCockpitTypes();
  const { isAdmin } = useCachedAdminCheck();

  // Create cockpit sub-items from database
  const cockpitSubItems: NavigationSubItem[] = cockpitTypes?.map(cockpit => ({
    name: cockpit.display_name,
    href: cockpit.route_path,
    icon: getIconByName(cockpit.icon || 'Gauge'),
    requiredTier: 'essential' as const
  })) || [];

  // Create Business Health sub-items
  const businessHealthSubItems: NavigationSubItem[] = [
    { name: "Dashboard", href: "/business-health/dashboard", icon: NavIcons.Activity, requiredTier: 'enterprise' as const },
    { name: "Strategy Map", href: "/business-health/heatmap", icon: NavIcons.Strategy, requiredTier: 'enterprise' as const },
    { name: "Initiative Tracker", href: "/business-health/tracker", icon: NavIcons.ClipboardList, requiredTier: 'enterprise' as const },
    { name: "Scenario Planning", href: "/business-health/scenarios", icon: NavIcons.TrendingUp, requiredTier: 'enterprise' as const },
    { name: "Risk Assessment", href: "/business-health/risk-matrix", icon: NavIcons.Shield, requiredTier: 'enterprise' as const }
  ];

  // Create structured navigation items
  const navigation: NavigationItem[] = [
    { name: "Home", href: "/", icon: NavIcons.Home, requiredTier: 'essential' },
    { 
      name: "Cockpits", 
      href: "#", 
      icon: NavIcons.Gauge, 
      requiredTier: 'essential',
      subItems: cockpitSubItems
    },
    { name: "Process Intelligence", href: "/process-intelligence", icon: NavIcons.ProcessIntelligence, requiredTier: 'professional' },
    { 
      name: "Business Health", 
      href: "#", 
      icon: NavIcons.Strategy, 
      requiredTier: 'enterprise',
      subItems: businessHealthSubItems
    },
    { name: "Insights", href: "/insights", icon: NavIcons.Insights, requiredTier: 'enterprise' },
    { name: "Myles", href: "/myles", icon: NavIcons.Myles, requiredTier: 'enterprise' },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: NavIcons.Shield, isAdmin: true }] : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    const nameParts = user.email.split("@")[0].split(/[._-]/);
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/" || path === "#") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <img 
                    src="/lovable-uploads/0053895f-ef3b-4dcd-b68c-8857f6db4bed.png" 
                    className="h-6 w-auto" 
                    alt="Business Transformation Hub Logo" 
                  />
                </Link>
              </div>
              
              {/* Hide navigation items on mobile using both JavaScript and CSS */}
              <div className={`${isMobile ? 'hidden' : 'block'} hidden md:block`}>
                <NavigationItems 
                  navigation={navigation} 
                  isActive={isActive} 
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <UserMenu 
                user={user} 
                signOut={signOut} 
                getUserInitials={getUserInitials}
                isAdmin={isAdmin}
              />
              
              {/* Hide mobile menu button on mobile - let bottom nav handle it */}
              <div className={`${isMobile ? 'hidden' : 'flex'} flex md:hidden`}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hide mobile menu on mobile - let bottom nav handle it */}
        {!isMobile && (
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            user={user}
            navigation={navigation}
            isActive={isActive}
            onCloseMenu={closeMobileMenu}
            onSignOut={signOut}
            getUserInitials={getUserInitials}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
