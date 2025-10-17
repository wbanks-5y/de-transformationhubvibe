/**
 * Utility functions for cockpit form field generation
 */

/**
 * Generates an internal name from a display name
 * Converts to lowercase, removes special characters, replaces spaces with underscores
 */
export const generateInternalName = (displayName: string): string => {
  if (!displayName.trim()) return '';
  
  return displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

/**
 * Generates a route path from an internal name
 */
export const generateRoutePath = (internalName: string): string => {
  if (!internalName.trim()) return '';
  
  return `/cockpit/${internalName.toLowerCase().replace(/_/g, '-')}`;
};

/**
 * Generates both internal name and route path from display name
 */
export const generateCockpitFields = (displayName: string) => {
  const internalName = generateInternalName(displayName);
  const routePath = generateRoutePath(internalName);
  
  return {
    internalName,
    routePath
  };
};