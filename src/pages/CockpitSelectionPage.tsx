
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCockpitTypes } from "@/hooks/use-cockpit-data";
import { getIconByName } from "@/utils/iconUtils";
import BackButton from "@/components/ui/back-button";

const CockpitSelectionPage: React.FC = () => {
  const { data: cockpitTypes } = useCockpitTypes();

  // Simple inline styles for better WebAppView compatibility
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'white',
    paddingBottom: '80px' // Space for bottom navigation
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    textAlign: 'center' as const
  };

  const contentStyle: React.CSSProperties = {
    padding: '16px'
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    marginBottom: '8px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#111827',
    transition: 'background-color 0.2s'
  };

  const iconContainerStyle: React.CSSProperties = {
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px'
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '4px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <BackButton className="mb-0" />
        <h1 style={titleStyle}>Select a Cockpit</h1>
      </div>
      
      <div style={contentStyle}>
        {cockpitTypes?.map((cockpit) => {
          const IconComponent = getIconByName(cockpit.icon);
          
          return (
            <Link
              key={cockpit.id}
              to={cockpit.route_path}
              style={itemStyle}
              onTouchStart={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div style={iconContainerStyle}>
                <IconComponent size={20} />
              </div>
              <div style={textContainerStyle}>
                <div style={nameStyle}>{cockpit.display_name}</div>
                {cockpit.description && (
                  <div style={descriptionStyle}>{cockpit.description}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CockpitSelectionPage;
