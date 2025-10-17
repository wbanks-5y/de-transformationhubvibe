
import { useScrollTop } from "@/hooks/useScrollTop";

/**
 * Component that scrolls the window to the top on route change
 * This is a "side-effect" component that doesn't render anything
 */
const ScrollToTop = () => {
  useScrollTop();
  return null;
};

export default ScrollToTop;
