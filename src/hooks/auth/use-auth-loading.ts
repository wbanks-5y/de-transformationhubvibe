
import { useState, useEffect, useRef } from 'react';

/**
 * Much more conservative auth loading management 
 */
export const useAuthLoading = (
  loading: boolean, 
  isAuthenticating: boolean, 
  isRefreshingSession: boolean
) => {
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const loadingStartTime = useRef<number | null>(null);
  
  // Check if we're in a mobile environment
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Much longer, more reasonable timeouts
  const LOADING_TIMEOUT = isMobile ? 2 * 60 * 1000 : 5 * 60 * 1000; // 2 minutes mobile, 5 minutes desktop
  const LONG_LOADING_THRESHOLD = isMobile ? 15000 : 20000; // 15 seconds mobile, 20 seconds desktop

  useEffect(() => {
    const isLoadingState = loading || isAuthenticating || isRefreshingSession;
    
    if (isLoadingState && loadingStartTime.current === null) {
      loadingStartTime.current = Date.now();
      setLongLoadingDetected(false);
      setAuthTimeout(false);
      console.log(`Loading started (${isMobile ? 'mobile' : 'desktop'} timeouts)`);
    } else if (!isLoadingState) {
      loadingStartTime.current = null;
      setLongLoadingDetected(false);
      setAuthTimeout(false);
    }
  }, [loading, isAuthenticating, isRefreshingSession, isMobile]);

  useEffect(() => {
    if (loadingStartTime.current === null) return;

    const checkLoadingDuration = () => {
      if (loadingStartTime.current === null) return;
      
      const elapsed = Date.now() - loadingStartTime.current;
      
      if (elapsed > LONG_LOADING_THRESHOLD && !longLoadingDetected) {
        console.log(`Long loading detected after ${elapsed}ms`);
        setLongLoadingDetected(true);
      }
      
      if (elapsed > LOADING_TIMEOUT) {
        console.log(`Auth timeout after ${elapsed}ms`);
        setAuthTimeout(true);
        loadingStartTime.current = null;
      }
    };

    // Check every 5 seconds - much less frequent
    const interval = setInterval(checkLoadingDuration, 5000);
    
    return () => clearInterval(interval);
  }, [longLoadingDetected, LONG_LOADING_THRESHOLD, LOADING_TIMEOUT, isMobile]);

  return {
    longLoadingDetected,
    authTimeout,
    setAuthTimeout
  };
};
