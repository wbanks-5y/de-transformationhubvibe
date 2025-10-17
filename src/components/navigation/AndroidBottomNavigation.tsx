
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare } from "lucide-react";
import { NavIcons } from "./icons";

const AndroidBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('AndroidBottomNavigation render:', { 
    currentPath: location.pathname 
  });

  // Simple navigation items for Android
  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Cockpits", href: "/cockpit-selection", icon: NavIcons.FinanceCockpit },
    { name: "Myles", href: "/myles", icon: MessageSquare },
    { name: "Insights", href: "/insights", icon: NavIcons.Insights },
  ];

  const isActive = (path: string) => {
    if (path === "/cockpit-selection") {
      return location.pathname.startsWith("/cockpit/") || location.pathname === "/cockpit-selection";
    }
    return location.pathname === path;
  };

  const handleNavItemClick = (item: any) => {
    console.log('Nav item clicked:', item.name, 'navigating to:', item.href);
    navigate(item.href);
  };

  // Use inline styles for better WebAppView compatibility
  const containerStyle: React.CSSProperties = {
    position: 'fixed' as const,
    bottom: '0px',
    left: '0px',
    right: '0px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    zIndex: 50,
    height: '64px',
    display: 'flex'
  };

  const itemStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#6b7280',
    fontSize: '12px',
    padding: '8px 4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  };

  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    color: '#4f46e5'
  };

  const iconStyle: React.CSSProperties = {
    marginBottom: '4px'
  };

  return (
    <div style={containerStyle}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            style={active ? activeItemStyle : itemStyle}
          >
            <div style={iconStyle}>
              <IconComponent size={20} />
            </div>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AndroidBottomNavigation;
