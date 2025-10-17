
export const isAndroidWebView = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Explicitly exclude iOS devices first
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return false;
  }
  
  // Check for Android WebView indicators
  const isAndroid = userAgent.includes('android');
  const isWebView = userAgent.includes('wv') || // WebView indicator
                    userAgent.includes('version/') && userAgent.includes('chrome/') ||
                    (window as any).AndroidInterface !== undefined; // Custom interface check
  
  return isAndroid && isWebView;
};

export const isAndroidPhone = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Explicitly exclude iOS devices first
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return false;
  }
  
  // Detect any Android device (including WebAppView)
  const isAndroid = userAgent.includes('android');
  const isMobile = userAgent.includes('mobile') || 
                   userAgent.includes('phone') ||
                   /android.*mobile/i.test(userAgent);
  
  // Also detect WebAppView specifically
  const isWebAppView = userAgent.includes('webappview') ||
                       userAgent.includes('webapp') ||
                       // Detect if running in a simplified browser environment
                       !userAgent.includes('chrome/') && isAndroid;
  
  return isAndroid && (isMobile || isWebAppView);
};

export const isMobileWebView = (): boolean => {
  const userAgent = navigator.userAgent;
  const isIOS = userAgent.includes('iPhone') && userAgent.includes('Mobile');
  return isAndroidWebView() || isAndroidPhone() || isIOS;
};

// Enhanced Android detection for better reliability
export const isAndroidEnvironment = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Explicitly exclude iOS devices first
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    console.log('iOS device detected, excluding from Android environment');
    return false;
  }
  
  // Primary check: must be Android
  const isAndroid = userAgent.includes('android');
  
  // If not Android, definitely not Android environment
  if (!isAndroid) {
    return false;
  }
  
  // Secondary checks for Android-specific optimizations
  const isMobile = userAgent.includes('mobile') || userAgent.includes('phone');
  const isWebView = isAndroidWebView();
  const hasTouch = 'ontouchstart' in window;
  const isMobileScreen = window.innerWidth <= 768;
  
  console.log('Android environment check:', { 
    isAndroid, 
    isMobile, 
    isWebView, 
    hasTouch, 
    isMobileScreen,
    userAgent: userAgent.slice(0, 100) + '...'
  });
  
  // For Android devices, apply optimizations if it's mobile or has touch
  return isAndroid && (isMobile || isWebView || hasTouch || isMobileScreen);
};

// CSS class helper for Android WebView specific styling
export const getWebViewClasses = (): string => {
  if (isAndroidEnvironment()) {
    return 'android-webview mobile-optimized';
  }
  return '';
};

// Hook for Android optimization decisions
export const useAndroidOptimization = () => {
  const isAndroid = isAndroidEnvironment();
  const isWebView = isAndroidWebView();
  
  console.log('Android Detection:', { 
    isAndroid, 
    isWebView, 
    userAgent: navigator.userAgent.slice(0, 100) + '...',
    platform: navigator.platform
  });
  
  return {
    isAndroid,
    isWebView,
    shouldUseSimplified: isAndroid,
    shouldDisableAnimations: isAndroid,
    shouldUseInlineStyles: isAndroid
  };
};
