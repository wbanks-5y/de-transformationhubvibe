
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileViewport = windowWidth < MOBILE_BREAKPOINT
      
      // Enhanced mobile detection
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const hasSmallScreen = windowWidth <= 900 && windowHeight <= 1200
      
      // Force mobile mode for small viewports or clear mobile devices
      const shouldBeMobile = isMobileViewport || (hasSmallScreen && (isMobileUserAgent || isTouchDevice))
      
      console.log('Mobile detection:', { 
        windowWidth, 
        windowHeight, 
        isMobileViewport, 
        isMobileUserAgent, 
        isTouchDevice, 
        hasSmallScreen,
        shouldBeMobile 
      });
      
      setIsMobile(shouldBeMobile)
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Call immediately to set initial state
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
