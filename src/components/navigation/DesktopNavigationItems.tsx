
import React from "react";
import NavigationItem from "./NavigationItem";
import { NavigationItem as NavigationItemType } from "./types";

interface DesktopNavigationItemsProps {
  navigation: NavigationItemType[];
  isActive: (path: string) => boolean;
}

const DesktopNavigationItems: React.FC<DesktopNavigationItemsProps> = ({ 
  navigation, 
  isActive 
}) => {
  return (
    <div className="hidden md:block md:ml-6 flex-grow">
      <div className="flex items-center space-x-1">
        {navigation.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isMobile={false}
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopNavigationItems;
