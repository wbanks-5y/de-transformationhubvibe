import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Gauge, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Factory, 
  Users, 
  CreditCard,
  Truck,
  Building2,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Settings,
  ChevronDown,
  Trophy,
  Heart,
  Clock,
  Award,
  Calculator,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Folder,
  Briefcase,
  Shield,
  Star,
  Eye,
  Percent,
  CircleDollarSign,
  Coins,
  Wallet,
  ClipboardList,
  ClipboardCheck,
  ClipboardCopy,
  ShoppingCart,
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
  Lightbulb,
  FileText,
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Building,
  Warehouse,
  Receipt,
  TrendingDown,
  Banknote,
  Handshake,
  Wrench,
  Cog,
  Database,
  Server,
  Monitor,
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
  Edit,
  Save,
  Trash,
  Archive,
  Bookmark,
  Tag,
  Flag,
  Bell,
  BellOff,
  MessageSquare,
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
  Rewind,
  Scissors,
  ClipboardPaste
} from "lucide-react";

// Expanded list of available icons organized by category
const availableIcons = [
  // Performance & Analytics
  { name: 'Trophy', icon: Trophy, label: 'Trophy', keywords: ['performance', 'achievement', 'winner', 'success'] },
  { name: 'Award', icon: Award, label: 'Award', keywords: ['recognition', 'achievement', 'excellence'] },
  { name: 'Target', icon: Target, label: 'Target', keywords: ['goal', 'objective', 'aim', 'focus'] },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Trending Up', keywords: ['growth', 'increase', 'improvement', 'rising'] },
  { name: 'TrendingDown', icon: TrendingDown, label: 'Trending Down', keywords: ['decline', 'decrease', 'falling'] },
  { name: 'Activity', icon: Activity, label: 'Activity', keywords: ['monitoring', 'pulse', 'health', 'performance'] },
  { name: 'Gauge', icon: Gauge, label: 'Gauge', keywords: ['dashboard', 'cockpit', 'metrics', 'measurement'] },

  // Charts & Analytics
  { name: 'BarChart3', icon: BarChart3, label: 'Bar Chart', keywords: ['analytics', 'data', 'reporting'] },
  { name: 'PieChart', icon: PieChart, label: 'Pie Chart', keywords: ['analytics', 'distribution', 'breakdown'] },
  { name: 'LineChart', icon: LineChart, label: 'Line Chart', keywords: ['trends', 'time series', 'analytics'] },

  // Financial
  { name: 'DollarSign', icon: DollarSign, label: 'Dollar Sign', keywords: ['finance', 'money', 'revenue', 'sales', 'financial'] },
  { name: 'CircleDollarSign', icon: CircleDollarSign, label: 'Circle Dollar', keywords: ['finance', 'profit', 'revenue'] },
  { name: 'CreditCard', icon: CreditCard, label: 'Credit Card', keywords: ['payment', 'finance', 'billing', 'credit'] },
  { name: 'Wallet', icon: Wallet, label: 'Wallet', keywords: ['cash', 'bank', 'money', 'finance'] },
  { name: 'Coins', icon: Coins, label: 'Coins', keywords: ['money', 'finance', 'currency'] },
  { name: 'Banknote', icon: Banknote, label: 'Banknote', keywords: ['cash', 'money', 'currency'] },
  { name: 'Receipt', icon: Receipt, label: 'Receipt', keywords: ['transaction', 'purchase', 'record'] },

  // Business & Operations
  { name: 'Building2', icon: Building2, label: 'Building', keywords: ['office', 'company', 'corporate', 'business'] },
  { name: 'Building', icon: Building, label: 'Office Building', keywords: ['office', 'corporate', 'headquarters'] },
  { name: 'Factory', icon: Factory, label: 'Factory', keywords: ['manufacturing', 'production', 'industrial'] },
  { name: 'Warehouse', icon: Warehouse, label: 'Warehouse', keywords: ['storage', 'inventory', 'logistics'] },
  { name: 'Briefcase', icon: Briefcase, label: 'Briefcase', keywords: ['business', 'professional', 'work'] },

  // People & Teams
  { name: 'Users', icon: Users, label: 'Users', keywords: ['team', 'people', 'hr', 'human resources', 'customer'] },
  { name: 'UserCheck', icon: UserCheck, label: 'User Check', keywords: ['approval', 'verification', 'validation'] },

  // Supply Chain & Logistics
  { name: 'Package', icon: Package, label: 'Package', keywords: ['inventory', 'shipping', 'procurement', 'supply'] },
  { name: 'Truck', icon: Truck, label: 'Truck', keywords: ['delivery', 'logistics', 'transport', 'shipping'] },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'Shopping Cart', keywords: ['procurement', 'purchasing', 'buying'] },
  { name: 'Car', icon: Car, label: 'Car', keywords: ['transport', 'vehicle', 'fleet'] },
  { name: 'Plane', icon: Plane, label: 'Plane', keywords: ['transport', 'travel', 'logistics'] },
  { name: 'Ship', icon: Ship, label: 'Ship', keywords: ['shipping', 'maritime', 'transport'] },
  { name: 'Train', icon: Train, label: 'Train', keywords: ['transport', 'logistics', 'rail'] },

  // Projects & Tasks
  { name: 'ClipboardList', icon: ClipboardList, label: 'Clipboard List', keywords: ['project', 'tasks', 'management', 'todo'] },
  { name: 'ClipboardCheck', icon: ClipboardCheck, label: 'Clipboard Check', keywords: ['completed', 'verified', 'approved'] },
  { name: 'ClipboardCopy', icon: ClipboardCopy, label: 'Clipboard Copy', keywords: ['duplicate', 'template'] },
  { name: 'Folder', icon: Folder, label: 'Folder', keywords: ['organization', 'documents', 'files'] },
  { name: 'FileText', icon: FileText, label: 'File Text', keywords: ['document', 'report', 'text'] },

  // Technology & Tools
  { name: 'Settings', icon: Settings, label: 'Settings', keywords: ['configuration', 'admin', 'control'] },
  { name: 'Zap', icon: Zap, label: 'Zap', keywords: ['energy', 'power', 'speed', 'automation'] },
  { name: 'Wrench', icon: Wrench, label: 'Wrench', keywords: ['maintenance', 'repair', 'tools'] },
  { name: 'Cog', icon: Cog, label: 'Cog', keywords: ['configuration', 'mechanics', 'process'] },
  { name: 'Database', icon: Database, label: 'Database', keywords: ['data', 'storage', 'information'] },
  { name: 'Server', icon: Server, label: 'Server', keywords: ['infrastructure', 'hosting', 'technology'] },
  { name: 'Monitor', icon: Monitor, label: 'Monitor', keywords: ['display', 'screen', 'computer'] },
  { name: 'Calculator', icon: Calculator, label: 'Calculator', keywords: ['calculation', 'math', 'finance'] },

  // Communication & Service
  { name: 'Headphones', icon: Headphones, label: 'Headphones', keywords: ['service', 'support', 'field service', 'customer service'] },
  { name: 'Phone', icon: Phone, label: 'Phone', keywords: ['communication', 'contact', 'support'] },
  { name: 'Mail', icon: Mail, label: 'Mail', keywords: ['email', 'communication', 'contact'] },
  { name: 'MessageSquare', icon: MessageSquare, label: 'Message', keywords: ['chat', 'communication'] },
  { name: 'Bell', icon: Bell, label: 'Bell', keywords: ['notification', 'alert', 'reminder'] },

  // Status & Alerts
  { name: 'CheckCircle', icon: CheckCircle, label: 'Check Circle', keywords: ['success', 'completed', 'approved'] },
  { name: 'AlertTriangle', icon: AlertTriangle, label: 'Alert Triangle', keywords: ['warning', 'caution', 'risk'] },
  { name: 'AlertCircle', icon: AlertCircle, label: 'Alert Circle', keywords: ['info', 'notice', 'attention'] },
  { name: 'Shield', icon: Shield, label: 'Shield', keywords: ['security', 'protection', 'safety'] },

  // Quality & Rating
  { name: 'Star', icon: Star, label: 'Star', keywords: ['rating', 'quality', 'favorite', 'premium'] },
  { name: 'Heart', icon: Heart, label: 'Heart', keywords: ['favorite', 'liked', 'health'] },
  { name: 'Eye', icon: Eye, label: 'Eye', keywords: ['visibility', 'monitoring', 'watch'] },

  // Time & Calendar
  { name: 'Clock', icon: Clock, label: 'Clock', keywords: ['time', 'schedule', 'duration'] },
  { name: 'Calendar', icon: Calendar, label: 'Calendar', keywords: ['schedule', 'date', 'planning'] },

  // Additional Icons
  { name: 'Smartphone', icon: Smartphone, label: 'Smartphone', keywords: ['mobile', 'device', 'communication'] },
  { name: 'Tablet', icon: Tablet, label: 'Tablet', keywords: ['device', 'mobile', 'technology'] },
  { name: 'Laptop', icon: Laptop, label: 'Laptop', keywords: ['computer', 'device', 'technology'] },
  { name: 'Cloud', icon: Cloud, label: 'Cloud', keywords: ['storage', 'online', 'backup'] },
  { name: 'Wifi', icon: Wifi, label: 'Wifi', keywords: ['network', 'internet', 'connection'] },
  { name: 'Battery', icon: Battery, label: 'Battery', keywords: ['power', 'energy', 'charge'] },
  { name: 'Power', icon: Power, label: 'Power', keywords: ['energy', 'electricity', 'on/off'] },
  { name: 'Radio', icon: Radio, label: 'Radio', keywords: ['communication', 'broadcast', 'audio'] },
  { name: 'Tv', icon: Tv, label: 'TV', keywords: ['display', 'screen', 'entertainment'] },
  { name: 'Camera', icon: Camera, label: 'Camera', keywords: ['photo', 'image', 'capture'] },
  { name: 'Printer', icon: Printer, label: 'Printer', keywords: ['print', 'document', 'output'] },
  { name: 'MousePointer', icon: MousePointer, label: 'Mouse Pointer', keywords: ['cursor', 'click', 'interface'] },
  { name: 'Keyboard', icon: Keyboard, label: 'Keyboard', keywords: ['input', 'typing', 'computer'] },
  { name: 'Headset', icon: Headset, label: 'Headset', keywords: ['audio', 'communication', 'support'] },
  { name: 'Speaker', icon: Speaker, label: 'Speaker', keywords: ['audio', 'sound', 'output'] },
  { name: 'Volume2', icon: Volume2, label: 'Volume', keywords: ['audio', 'sound', 'level'] },
  { name: 'Music', icon: Music, label: 'Music', keywords: ['audio', 'entertainment', 'sound'] },
  { name: 'Video', icon: Video, label: 'Video', keywords: ['media', 'entertainment', 'visual'] },
  { name: 'Image', icon: Image, label: 'Image', keywords: ['photo', 'picture', 'visual'] },
  { name: 'FileImage', icon: FileImage, label: 'File Image', keywords: ['photo', 'picture', 'document'] },
  { name: 'FileVideo', icon: FileVideo, label: 'File Video', keywords: ['media', 'video', 'document'] },
  { name: 'FileAudio', icon: FileAudio, label: 'File Audio', keywords: ['sound', 'music', 'document'] },
  { name: 'Download', icon: Download, label: 'Download', keywords: ['save', 'import', 'transfer'] },
  { name: 'Upload', icon: Upload, label: 'Upload', keywords: ['send', 'export', 'transfer'] },
  { name: 'Share', icon: Share, label: 'Share', keywords: ['distribute', 'send', 'collaboration'] },
  { name: 'Link', icon: Link, label: 'Link', keywords: ['connection', 'url', 'reference'] },
  { name: 'ExternalLink', icon: ExternalLink, label: 'External Link', keywords: ['outside', 'reference', 'url'] },
  { name: 'Copy', icon: Copy, label: 'Copy', keywords: ['duplicate', 'clipboard', 'clone'] },
  { name: 'Scissors', icon: Scissors, label: 'Cut', keywords: ['scissors', 'remove', 'clipboard'] },
  { name: 'ClipboardPaste', icon: ClipboardPaste, label: 'Paste', keywords: ['clipboard', 'insert', 'add'] },
  { name: 'Edit', icon: Edit, label: 'Edit', keywords: ['modify', 'change', 'update'] },
  { name: 'Save', icon: Save, label: 'Save', keywords: ['store', 'keep', 'preserve'] },
  { name: 'Trash', icon: Trash, label: 'Trash', keywords: ['delete', 'remove', 'discard'] },
  { name: 'Archive', icon: Archive, label: 'Archive', keywords: ['store', 'backup', 'preserve'] },
  { name: 'Bookmark', icon: Bookmark, label: 'Bookmark', keywords: ['save', 'favorite', 'mark'] },
  { name: 'Tag', icon: Tag, label: 'Tag', keywords: ['label', 'category', 'mark'] },
  { name: 'Flag', icon: Flag, label: 'Flag', keywords: ['mark', 'important', 'priority'] },
  { name: 'BellOff', icon: BellOff, label: 'Bell Off', keywords: ['mute', 'silence', 'disable'] },
  { name: 'MessageCircle', icon: MessageCircle, label: 'Message Circle', keywords: ['chat', 'communication', 'talk'] },
  { name: 'Send', icon: Send, label: 'Send', keywords: ['transmit', 'deliver', 'submit'] },
  { name: 'Inbox', icon: Inbox, label: 'Inbox', keywords: ['receive', 'mail', 'messages'] },
  { name: 'Search', icon: Search, label: 'Search', keywords: ['find', 'look', 'query'] },
  { name: 'Filter', icon: Filter, label: 'Filter', keywords: ['sort', 'organize', 'refine'] },
  { name: 'Menu', icon: Menu, label: 'Menu', keywords: ['navigation', 'options', 'list'] },
  { name: 'Grid', icon: Grid, label: 'Grid', keywords: ['layout', 'organize', 'structure'] },
  { name: 'List', icon: List, label: 'List', keywords: ['items', 'organize', 'sequence'] },
  { name: 'Columns', icon: Columns, label: 'Columns', keywords: ['layout', 'structure', 'organize'] },
  { name: 'Rows', icon: Rows, label: 'Rows', keywords: ['layout', 'structure', 'organize'] },
  { name: 'Layout', icon: Layout, label: 'Layout', keywords: ['design', 'structure', 'organize'] },
  { name: 'Sidebar', icon: Sidebar, label: 'Sidebar', keywords: ['navigation', 'panel', 'menu'] },
  { name: 'PanelLeft', icon: PanelLeft, label: 'Panel Left', keywords: ['sidebar', 'navigation', 'layout'] },
  { name: 'PanelRight', icon: PanelRight, label: 'Panel Right', keywords: ['sidebar', 'navigation', 'layout'] },
  { name: 'Maximize', icon: Maximize, label: 'Maximize', keywords: ['expand', 'fullscreen', 'enlarge'] },
  { name: 'Minimize', icon: Minimize, label: 'Minimize', keywords: ['shrink', 'reduce', 'small'] },
  { name: 'RotateCcw', icon: RotateCcw, label: 'Rotate CCW', keywords: ['turn', 'spin', 'reverse'] },
  { name: 'RotateCw', icon: RotateCw, label: 'Rotate CW', keywords: ['turn', 'spin', 'clockwise'] },
  { name: 'RefreshCw', icon: RefreshCw, label: 'Refresh', keywords: ['reload', 'update', 'sync'] },
  { name: 'PlayCircle', icon: PlayCircle, label: 'Play Circle', keywords: ['start', 'begin', 'run'] },
  { name: 'PauseCircle', icon: PauseCircle, label: 'Pause Circle', keywords: ['stop', 'halt', 'wait'] },
  { name: 'StopCircle', icon: StopCircle, label: 'Stop Circle', keywords: ['end', 'terminate', 'finish'] },
  { name: 'SkipBack', icon: SkipBack, label: 'Skip Back', keywords: ['previous', 'rewind', 'back'] },
  { name: 'SkipForward', icon: SkipForward, label: 'Skip Forward', keywords: ['next', 'advance', 'forward'] },
  { name: 'FastForward', icon: FastForward, label: 'Fast Forward', keywords: ['speed', 'quick', 'advance'] },
  { name: 'Rewind', icon: Rewind, label: 'Rewind', keywords: ['back', 'reverse', 'previous'] },

  // Miscellaneous
  { name: 'Lightbulb', icon: Lightbulb, label: 'Lightbulb', keywords: ['idea', 'innovation', 'insight', 'creativity'] },
  { name: 'Globe', icon: Globe, label: 'Globe', keywords: ['global', 'world', 'international'] },
  { name: 'Home', icon: Home, label: 'Home', keywords: ['main', 'dashboard', 'overview'] },
  { name: 'Percent', icon: Percent, label: 'Percent', keywords: ['percentage', 'ratio', 'rate'] },
  { name: 'ArrowUp', icon: ArrowUp, label: 'Arrow Up', keywords: ['increase', 'growth', 'up'] },
  { name: 'ArrowDown', icon: ArrowDown, label: 'Arrow Down', keywords: ['decrease', 'down', 'reduction'] },
  { name: 'MoreHorizontal', icon: MoreHorizontal, label: 'More', keywords: ['options', 'menu', 'additional'] },
  { name: 'MapPin', icon: MapPin, label: 'Map Pin', keywords: ['location', 'place', 'position'] },
  { name: 'Handshake', icon: Handshake, label: 'Handshake', keywords: ['agreement', 'partnership', 'deal'] },
];

// Function to recommend icon based on cockpit name
const recommendIcon = (cockpitName: string): string => {
  const name = cockpitName.toLowerCase();
  
  // Direct matches first
  const directMatches: Record<string, string> = {
    'finance': 'DollarSign',
    'financial': 'CircleDollarSign',
    'sales': 'TrendingUp',
    'revenue': 'DollarSign',
    'procurement': 'ShoppingCart',
    'purchasing': 'ShoppingCart',
    'supply': 'Package',
    'inventory': 'Package',
    'warehouse': 'Warehouse',
    'logistics': 'Truck',
    'shipping': 'Truck',
    'manufacturing': 'Factory',
    'production': 'Factory',
    'hr': 'Users',
    'human': 'Users',
    'people': 'Users',
    'customer': 'Users',
    'service': 'Headphones',
    'support': 'Headphones',
    'field': 'Headphones',
    'project': 'ClipboardList',
    'projects': 'ClipboardList',
    'task': 'ClipboardList',
    'credit': 'CreditCard',
    'cash': 'Wallet',
    'bank': 'Wallet',
    'payment': 'CreditCard',
    'billing': 'Receipt',
    'performance': 'Trophy',
    'analytics': 'BarChart3',
    'dashboard': 'Gauge',
    'cockpit': 'Gauge',
    'metrics': 'Gauge',
    'admin': 'Settings',
    'configuration': 'Settings',
    'security': 'Shield',
    'maintenance': 'Wrench',
    'quality': 'Star',
    'innovation': 'Lightbulb',
    'insight': 'Lightbulb',
  };

  // Check for direct matches
  for (const [key, iconName] of Object.entries(directMatches)) {
    if (name.includes(key)) {
      return iconName;
    }
  }

  // Fallback to keyword matching
  for (const iconData of availableIcons) {
    for (const keyword of iconData.keywords) {
      if (name.includes(keyword)) {
        return iconData.name;
      }
    }
  }

  // Default fallback
  return 'Gauge';
};

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  cockpitName?: string; // Optional cockpit name for auto-recommendation
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect, cockpitName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-recommend icon when cockpit name changes
  useEffect(() => {
    if (cockpitName && !selectedIcon) {
      const recommendedIcon = recommendIcon(cockpitName);
      onIconSelect(recommendedIcon);
    }
  }, [cockpitName, selectedIcon, onIconSelect]);

  const selectedIconData = availableIcons.find(icon => icon.name === selectedIcon) || availableIcons[0];
  const SelectedIconComponent = selectedIconData.icon;

  // Filter icons based on search term
  const filteredIcons = availableIcons.filter(iconData => 
    iconData.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iconData.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <SelectedIconComponent className="h-4 w-4" />
              <span>{selectedIconData.label}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4 bg-white z-50">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            {cockpitName && (
              <div className="text-xs text-gray-500">
                Recommended for "{cockpitName}": {recommendIcon(cockpitName)}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
              {filteredIcons.map((iconData) => {
                const IconComponent = iconData.icon;
                const isRecommended = cockpitName && recommendIcon(cockpitName) === iconData.name;
                return (
                  <Button
                    key={iconData.name}
                    variant={selectedIcon === iconData.name ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col gap-1 h-auto p-2 ${isRecommended ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => {
                      onIconSelect(iconData.name);
                      setIsOpen(false);
                    }}
                    title={isRecommended ? `Recommended for ${cockpitName}` : iconData.label}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{iconData.label}</span>
                  </Button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default IconSelector;
