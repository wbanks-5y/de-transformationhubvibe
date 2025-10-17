
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTierCheck } from '@/hooks/auth/use-tier-check';
import { hasRequiredTier } from '@/types/tiers';
import { NavigationItem, NavigationSubItem } from './types';

interface NavigationDropdownProps {
  item: NavigationItem;
  isActive: (path: string) => boolean;
}

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ item, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only call hooks at the top level - get user's tier info once
  const { hasAccess, userTier } = useTierCheck(item.requiredTier || 'essential');

  // Now we can do conditional returns after all hooks are called
  if (!hasAccess && !item.isAdmin) {
    return null;
  }

  // Filter subItems using the utility function instead of hooks
  const accessibleSubItems = item.subItems?.filter(subItem => {
    const requiredTier = subItem.requiredTier || 'essential';
    return userTier ? hasRequiredTier(userTier, requiredTier) : false;
  }) || [];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to allow moving to dropdown
  };

  const handleClick = (e: React.MouseEvent) => {
    if (item.href === '#') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (item.href === '#') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const isItemActive = item.href !== '#' ? isActive(item.href) : 
    accessibleSubItems.some(subItem => isActive(subItem.href));

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href === '#' ? (
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            isItemActive
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <item.icon
            className={cn(
              "mr-2 flex-shrink-0 h-5 w-5",
              isItemActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
            )}
            aria-hidden="true"
          />
          {item.name}
          <ChevronDown 
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )} 
          />
        </button>
      ) : (
        <Link
          to={item.href}
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isItemActive
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <item.icon
            className={cn(
              "mr-2 flex-shrink-0 h-5 w-5",
              isItemActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
            )}
            aria-hidden="true"
          />
          {item.name}
          {item.subItems && item.subItems.length > 0 && (
            <ChevronDown 
              className={cn(
                "ml-1 h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )} 
            />
          )}
        </Link>
      )}

      {/* Dropdown Menu */}
      {isOpen && accessibleSubItems.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
          <div className="py-2">
            {accessibleSubItems.map((subItem) => (
              <Link
                key={subItem.href}
                to={subItem.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                  isActive(subItem.href)
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                <div className="flex items-center">
                  <subItem.icon className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-medium">{subItem.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;
