
import React from "react";
import { 
  LucideIcon, 
  ChartBar, 
  BarChart4, 
  CircleDollarSign, 
  FileText, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Target,
  Clock,
  LineChart,
  Activity,
  Percent,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Award,
  PieChart,
  Zap,
  Gauge,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Briefcase,
  Package,
  Truck,
  Building,
  CreditCard,
  Heart,
  Star,
  Eye,
  Shield,
  Lightbulb,
  Headphones,
  Globe,
  Mail,
  Phone,
  MapPin,
  Home,
  Car,
  Plane,
  Ship,
  Train,
  Trophy,
  UserCheck,
  AlertTriangle,
  Folder,
  Factory,
  Building2,
  Calculator,
  TrendingDown,
  Coins,
  Wallet,
  ClipboardList,
  ClipboardCheck,
  ClipboardCopy,
  ShoppingCart,
  Banknote,
  Receipt,
  Warehouse,
  Handshake,
  Wrench,
  Cog,
  Database,
  Server,
  Monitor,
  MessageSquare,
  Bell,
  Smartphone,
  Tablet,
  Laptop,
  Cloud,
  Wifi,
  Battery,
  Power,
  Radio,
  Tv,
  Camera,
  Printer,
  MousePointer,
  Keyboard,
  Headset,
  Speaker,
  Volume2,
  Music,
  Video,
  Image,
  FileImage,
  FileVideo,
  FileAudio,
  Download,
  Upload,
  Share,
  Link,
  ExternalLink,
  Copy,
  Scissors,
  ClipboardPaste,
  Edit,
  Save,
  Trash,
  Archive,
  Bookmark,
  Tag,
  Flag,
  BellOff,
  MessageCircle,
  Send,
  Inbox,
  Search,
  Filter,
  Menu,
  Grid,
  List,
  Columns,
  Rows,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind
} from "lucide-react";

// Utility function to render an icon with a specific className
export const renderIcon = (Icon: LucideIcon, className: string = ""): React.ReactNode => {
  return React.createElement(Icon, { className });
};

// Helper to get the appropriate icon for a metric
export const getIconForMetric = (icon: React.ReactNode): LucideIcon => {
  // If the icon is already a React element, try to extract the type
  if (React.isValidElement(icon)) {
    // For icons created with createElement, we need to extract the type
    const iconType = icon.type;
    if (typeof iconType === 'function') {
      return iconType as LucideIcon;
    }
  }
  
  // Default fallback icons based on common names
  return ChartBar; // Default icon
};

// Comprehensive icon map with Android WebView safe icons
export const iconMap: Record<string, LucideIcon> = {
  // Core dashboard icons
  "Gauge": Gauge,
  "ChartBar": ChartBar,
  "BarChart3": BarChart3,
  "BarChart4": BarChart4,
  "PieChart": PieChart,
  "LineChart": LineChart,
  "TrendingUp": TrendingUp,
  "TrendingDown": TrendingDown,
  "Activity": Activity,
  "Target": Target,
  "Award": Award,
  "Trophy": Trophy,
  
  // Financial icons
  "DollarSign": DollarSign,
  "CircleDollarSign": CircleDollarSign,
  "CreditCard": CreditCard,
  "Wallet": Wallet,
  "Coins": Coins,
  "Banknote": Banknote,
  "Receipt": Receipt,
  
  // Business & Industry
  "Building2": Building2,
  "Building": Building,
  "Factory": Factory,
  "Warehouse": Warehouse,
  "Briefcase": Briefcase,
  "Users": Users,
  "UserCheck": UserCheck,
  "Handshake": Handshake,
  
  // Technology & Tools
  "Settings": Settings,
  "Zap": Zap,
  "Database": Database,
  "Monitor": Monitor,
  "Calculator": Calculator,
  "Shield": Shield,
  "Wrench": Wrench,
  "Cog": Cog,
  
  // Status & Alerts
  "CheckCircle": CheckCircle,
  "XCircle": XCircle,
  "AlertTriangle": AlertTriangle,
  "AlertCircle": AlertCircle,
  "Bell": Bell,
  "BellOff": BellOff,
  
  // Time & Navigation
  "Clock": Clock,
  "Calendar": Calendar,
  "Home": Home,
  "ArrowUp": ArrowUp,
  "ArrowDown": ArrowDown,
  "Search": Search,
  "Filter": Filter,
  
  // Communication
  "Mail": Mail,
  "Phone": Phone,
  "MessageSquare": MessageSquare,
  "MessageCircle": MessageCircle,
  "Send": Send,
  "Inbox": Inbox,
  
  // Operations & Logistics
  "Package": Package,
  "Truck": Truck,
  "ShoppingCart": ShoppingCart,
  "Plane": Plane,
  "Ship": Ship,
  "Train": Train,
  "Car": Car,
  
  // Documentation & Files
  "FileText": FileText,
  "Folder": Folder,
  "Archive": Archive,
  "Bookmark": Bookmark,
  "Tag": Tag,
  "Flag": Flag,
  
  // UI & Layout
  "Menu": Menu,
  "Grid": Grid,
  "List": List,
  "Columns": Columns,
  "Rows": Rows,
  "Layout": Layout,
  "Sidebar": Sidebar,
  
  // Additional common icons
  "Star": Star,
  "Heart": Heart,
  "Eye": Eye,
  "Lightbulb": Lightbulb,
  "Globe": Globe,
  "Percent": Percent,
  "MoreHorizontal": MoreHorizontal,
  "Headphones": Headphones,
  
  // Clipboard operations
  "ClipboardList": ClipboardList,
  "ClipboardCheck": ClipboardCheck,
  "ClipboardCopy": ClipboardCopy,
  
  // Media & devices
  "Camera": Camera,
  "Video": Video,
  "Music": Music,
  "Image": Image,
  "Smartphone": Smartphone,
  "Tablet": Tablet,
  "Laptop": Laptop
};

// Helper function to get icon component by name with comprehensive fallback
export const getIconByName = (iconName: string | undefined): LucideIcon => {
  if (!iconName) {
    console.warn('getIconByName: No icon name provided, using Gauge fallback');
    return Gauge;
  }
  
  // Direct lookup
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  
  // Case-insensitive lookup
  const lowerIconName = iconName.toLowerCase();
  const matchedKey = Object.keys(iconMap).find(key => key.toLowerCase() === lowerIconName);
  if (matchedKey) {
    return iconMap[matchedKey];
  }
  
  // Partial matching for common variations
  const partialMatches: Record<string, LucideIcon> = {
    'finance': CircleDollarSign,
    'financial': CircleDollarSign,
    'money': DollarSign,
    'cash': Wallet,
    'sales': TrendingUp,
    'revenue': BarChart3,
    'profit': TrendingUp,
    'dashboard': Gauge,
    'cockpit': Gauge,
    'chart': ChartBar,
    'graph': LineChart,
    'trend': TrendingUp,
    'supply': Truck,
    'chain': Truck,
    'logistics': Truck,
    'warehouse': Warehouse,
    'inventory': Package,
    'procurement': ShoppingCart,
    'purchase': ShoppingCart,
    'manufacturing': Factory,
    'production': Factory,
    'project': ClipboardList,
    'task': ClipboardCheck,
    'customer': Users,
    'client': Users,
    'service': Headphones,
    'support': Headphones,
    'hr': Users,
    'human': Users,
    'resource': Users,
    'credit': CreditCard,
    'control': Shield,
    'risk': AlertTriangle,
    'security': Shield,
    'admin': Settings,
    'management': Settings,
    'insight': Lightbulb,
    'analytics': BarChart3,
    'intelligence': Activity
  };
  
  for (const [key, icon] of Object.entries(partialMatches)) {
    if (lowerIconName.includes(key)) {
      console.warn(`getIconByName: Using partial match for "${iconName}" -> "${key}"`);
      return icon;
    }
  }
  
  console.warn(`getIconByName: No match found for "${iconName}", using Gauge fallback`);
  return Gauge; // Final fallback
};
