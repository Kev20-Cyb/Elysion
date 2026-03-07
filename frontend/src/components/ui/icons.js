/**
 * Elysion Design System - Icon Library
 * Centralized Lucide React icons for consistent usage across the application
 * 
 * Usage: import { Icons } from '../components/ui/icons';
 *        <Icons.Dashboard size={20} />
 */

import {
  Home,
  Sparkles,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  Briefcase,
  Rocket,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Target,
  PiggyBank,
  BarChart3,
  Landmark,
  Shield,
  Scale,
  Smartphone,
  Monitor,
  PartyPopper,
  Wallet,
  FileBarChart,
  Receipt,
  FolderOpen,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Mail,
  Lock,
  Unlock,
  CreditCard,
  Euro,
  Percent,
  Calculator,
  LineChart,
  PieChart,
  Users,
  UserPlus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  MoreHorizontal,
  Bell,
  BellOff,
  Star,
  StarOff,
  Heart,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Sun,
  Moon,
  Palette,
  Zap,
  Award,
  Trophy,
  Gift,
  Gem,
  Crown
} from 'lucide-react';

// Standardized icon sizes
export const IconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48
};

// Icon mapping for the application
export const Icons = {
  // Navigation
  Dashboard: Home,
  Simulator: Sparkles,
  Documents: FileText,
  Investment: TrendingUp,
  Profile: Settings,
  Logout: LogOut,
  Menu: Menu,
  Close: X,
  ChevronLeft: ChevronLeft,
  ChevronRight: ChevronRight,
  ArrowRight: ArrowRight,
  ArrowLeft: ArrowLeft,
  ExternalLink: ExternalLink,
  
  // User types
  Employee: Briefcase,
  Freelancer: Rocket,
  BusinessOwner: Building2,
  User: User,
  Users: Users,
  UserPlus: UserPlus,
  
  // Actions
  Add: Plus,
  Edit: Edit,
  Delete: Trash2,
  View: Eye,
  Upload: Upload,
  Download: Download,
  Search: Search,
  Filter: Filter,
  Copy: Copy,
  Share: Share2,
  Refresh: RefreshCw,
  
  // Status & Feedback
  Success: CheckCircle,
  Error: AlertCircle,
  Info: Info,
  Help: HelpCircle,
  Warning: AlertCircle,
  Loading: Loader2,
  Check: Check,
  
  // Finance
  Target: Target,
  Money: PiggyBank,
  Wallet: Wallet,
  Euro: Euro,
  Percent: Percent,
  CreditCard: CreditCard,
  Bank: Landmark,
  Calculator: Calculator,
  
  // Charts & Data
  Chart: BarChart3,
  LineChart: LineChart,
  PieChart: PieChart,
  Stats: FileBarChart,
  
  // Documents
  Document: FileText,
  Folder: FolderOpen,
  Receipt: Receipt,
  
  // Risk Profiles
  Prudent: Shield,
  Balanced: Scale,
  Dynamic: Rocket,
  
  // Devices
  Mobile: Smartphone,
  Desktop: Monitor,
  
  // Professional
  Office: Building2,
  Work: Briefcase,
  
  // Celebration & Rewards
  Celebration: PartyPopper,
  Award: Award,
  Trophy: Trophy,
  Gift: Gift,
  Star: Star,
  StarOff: StarOff,
  Heart: Heart,
  Crown: Crown,
  Gem: Gem,
  Zap: Zap,
  
  // Time
  Calendar: Calendar,
  Clock: Clock,
  
  // Communication
  Mail: Mail,
  Bell: Bell,
  BellOff: BellOff,
  
  // Security
  Lock: Lock,
  Unlock: Unlock,
  
  // UI
  MoreVertical: MoreVertical,
  MoreHorizontal: MoreHorizontal,
  SortAsc: SortAsc,
  SortDesc: SortDesc,
  Sun: Sun,
  Moon: Moon,
  Palette: Palette
};

// Helper function to get icon by name
export const getIcon = (name, props = {}) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon library`);
    return null;
  }
  return <IconComponent {...props} />;
};

// User type icon helper
export const getUserTypeIcon = (userType, props = {}) => {
  const iconMap = {
    employee: Icons.Employee,
    freelancer: Icons.Freelancer,
    business_owner: Icons.BusinessOwner
  };
  const IconComponent = iconMap[userType] || Icons.User;
  return <IconComponent {...props} />;
};

// Risk profile icon helper  
export const getRiskProfileIcon = (profile, props = {}) => {
  const iconMap = {
    prudent: Icons.Prudent,
    equilibre: Icons.Balanced,
    dynamique: Icons.Dynamic
  };
  const IconComponent = iconMap[profile] || Icons.Target;
  return <IconComponent {...props} />;
};

// Document category icon helper
export const getDocumentCategoryIcon = (category, props = {}) => {
  const iconMap = {
    salary_slip: Icons.Receipt,
    career_statement: Icons.Stats,
    tax_declaration: Icons.Chart,
    retirement_contract: Icons.Bank,
    other: Icons.Document
  };
  const IconComponent = iconMap[category] || Icons.Document;
  return <IconComponent {...props} />;
};

export default Icons;
