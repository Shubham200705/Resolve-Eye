import { useAppStore } from '@/store/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export function Header({ onMenuClick, title, subtitle }: HeaderProps) {
  const { unreadCount } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3.5 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground leading-tight truncate">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
        </div>

        <div className="hidden md:block w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues, places..."
              className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/explore?q=${encodeURIComponent(e.currentTarget.value)}`);
                }
              }}
            />
          </div>
        </div>

        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[0.6rem] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
