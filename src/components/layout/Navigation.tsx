import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  History, 
  FileText, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Chrome,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import logo1 from '../../assets/1.png';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAuthModalOpen: () => void;
  onFeedbackModalOpen: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onAuthModalOpen,
  onFeedbackModalOpen
}) => {
  const { user, signOut, isGuest, guestId } = useAuth();

  const tabs = [
    { id: 'analyzer', label: 'Link Analyzer', icon: Search },
    { id: 'history', label: 'My History', icon: History },
    { id: 'notes', label: 'AI Notes', icon: FileText },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (user.is_anonymous && guestId) {
      return `Guest #${guestId.split('_')[2] || 'Unknown'}`;
    }
    return user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (!user || user.is_anonymous) return 'G';
    const name = user.email?.split('@')[0] || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
            <img src={logo1} alt="LinkMage Logo" className="w-10 h-10 object-contain" />
                            <h1 className="text-2xl md:text-2xl font-bold tracking-tight via-white-800  bg-clip-text drop-shadow-lg font-sans ">

                LinkMage
              </h1>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => onTabChange(tab.id)}
                  className={`gap-2 transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10 hover:bg-muted/50' 
                      : 'hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onFeedbackModalOpen}
              className="gap-2 hover:bg-muted/50 transition-colors duration-200"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-muted/50 transition-all duration-200">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/10 to-primary/5">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isGuest && (
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                      Guest
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-lg border border-border/50 shadow-xl"
              >
                <div className="px-2 py-1.5">
                  {/* <p className="text-sm font-medium">{getUserDisplayName()}</p> */}
                  <p className="text-xs text-muted-foreground">
                    {isGuest ? 'Guest Session' : user?.email}
                  </p>
                </div>
                
                {isGuest && (
                  <>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={onAuthModalOpen} className="gap-2 hover:bg-muted/50">
                      <Chrome className="h-4 w-4" />
                      Sign in with Google
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onAuthModalOpen} className="gap-2 hover:bg-muted/50">
                      <Mail className="h-4 w-4" />
                      Sign in with Email
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem 
                  onClick={() => onTabChange('settings')}
                  className="gap-2 hover:bg-muted/50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 hover:bg-muted/50">
                  <LogOut className="h-4 w-4" />
                  {isGuest ? 'Reset Session' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => onTabChange(tab.id)}
                  size="sm"
                  className={`gap-2 whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
