
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.5ytechnology.businesstransformationhub',
  appName: 'Business Transformation Hub',
  webDir: 'dist',
  server: {
    url: 'https://d6ca7123-04d2-42f6-9c82-0b74b40d6203.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // This is crucial for iOS routing - ensures all routes serve index.html
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    // Handle iOS routing properly
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    // Android WebView optimizations
    webContentsDebuggingEnabled: false,
    allowMixedContent: false,
    captureInput: true,
    // Improve dropdown and select behavior
    webViewExtra: {
      allowFileAccess: true,
      allowUniversalAccessFromFileURLs: false,
      allowFileAccessFromFileURLs: false
    }
  },
  ios: {
    // Ensure proper handling of client-side routing
    contentInset: 'automatic',
    // This tells iOS to always serve index.html for any route
    serverBasePath: ''
  },
  // Critical for handling client-side routing in iOS
  bundledWebRuntime: false
};

export default config;
