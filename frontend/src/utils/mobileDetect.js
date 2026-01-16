/**
 * Mobile detection and performance optimization utilities
 */

// Detect if the app is running on a mobile device
export const isMobile = () => {
  // Check if running in Capacitor/Cordova (Android/iOS app)
  if (typeof window !== 'undefined') {
    // Check for Capacitor
    if (window.Capacitor) return true;
    
    // Check for Cordova
    if (window.cordova) return true;
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
  return false;
};

// Detect if device has low performance (for animation optimization)
export const isLowPerformance = () => {
  if (typeof window === 'undefined') return false;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 4) return true;
  
  // Check device memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true;
  
  return isMobile();
};

// Get optimized animation settings based on device
export const getAnimationSettings = () => {
  const mobile = isMobile();
  const lowPerf = isLowPerformance();
  
  return {
    // Disable expensive animations on mobile
    enableBackgroundAnimations: !mobile,
    enableHoverEffects: !mobile,
    enableParticles: !mobile && !lowPerf,
    enableBlur: !mobile,
    enableInfiniteLoops: !mobile,
    
    // Reduce animation durations on mobile
    transitionDuration: mobile ? 0.2 : 0.5,
    
    // Reduce animation complexity
    reduceMotion: mobile || lowPerf,
  };
};

// Conditionally apply framer-motion props based on device
export const conditionalAnimation = (animationProps) => {
  const settings = getAnimationSettings();
  
  if (settings.reduceMotion) {
    // Return minimal/no animation for mobile
    return {
      initial: animationProps.initial?.opacity !== undefined ? { opacity: 0 } : {},
      animate: animationProps.animate?.opacity !== undefined ? { opacity: 1 } : {},
      transition: { duration: settings.transitionDuration },
    };
  }
  
  return animationProps;
};

// Export settings as a hook for React components
export const useAnimationSettings = () => {
  return getAnimationSettings();
};
