
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Download, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { AppMode } from './ModeSelector';

interface UnifiedNavbarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  showModeSelector?: boolean;
}

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ 
  currentMode, 
  onModeChange, 
  showModeSelector = true 
}) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-semibold">LinkMage</span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                    Templates
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-background/95 backdrop-blur-lg border border-border/50">
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" />
                    LinkedIn Post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" />
                    Twitter Thread
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" />
                    Newsletter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-background/95 backdrop-blur-lg border border-border/50">
                  <DropdownMenuItem className="gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Download className="h-4 w-4" />
                    Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <BookOpen className="h-4 w-4 mr-2" />
                Docs
              </Button>
            </div>
          </div>

          {/* Center - Mode Selector */}
          {showModeSelector && (
            <div className="flex items-center gap-1 p-1 bg-muted/30 backdrop-blur-sm rounded-lg border border-border/30">
              <Button
                variant={currentMode === 'general' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('general')}
                className={`gap-2 transition-all duration-300 ${
                  currentMode === 'general' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                    : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <Zap className="h-4 w-4" />
                General
              </Button>
              
              <Button
                variant={currentMode === 'creator' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('creator')}
                className={`gap-2 transition-all duration-300 ${
                  currentMode === 'creator' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                    : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Creator
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs ml-1">
                  New
                </Badge>
              </Button>
            </div>
          )}

          {/* Right Section - User Menu */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/10 to-primary/5">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">User</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-background/95 backdrop-blur-lg border border-border/50"
              >
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
