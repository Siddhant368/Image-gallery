import { Search, Sun, Bell, Plus, Menu, Moon, Monitor } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUploadClick: () => void;
  onMenuClick?: () => void;
}

export default function Topbar({ searchQuery, setSearchQuery, onUploadClick, onMenuClick }: TopbarProps) {
  const { settings, updateSettings } = useSettings();

  const cycleTheme = () => {
    if (!settings) return;
    const themes: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system'];
    const nextTheme = themes[(themes.indexOf(settings.theme) + 1) % themes.length];
    updateSettings({ theme: nextTheme });
  };
  return (
    <header className="h-20 bg-brand-bgSecondary/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-6 sticky top-0 z-40 xl:pl-6">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="xl:hidden text-brand-textSecondary hover:text-brand-textMain">
          <Menu size={24} />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-textMuted" size={18} />
          <input
            type="text"
            placeholder="Search images by title, tag or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bgMain border border-brand-border rounded-full py-2.5 pl-11 pr-14 text-brand-textMain text-sm focus:outline-none focus:border-[#10B981] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block bg-brand-bgCard text-brand-textMuted text-[10px] px-1.5 py-0.5 rounded border border-brand-border">⌘</kbd>
            <kbd className="hidden sm:inline-block bg-brand-bgCard text-brand-textMuted text-[10px] px-1.5 py-0.5 rounded border border-brand-border">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={cycleTheme}
          className="text-brand-textSecondary hover:text-brand-textMain transition-colors flex items-center justify-center p-2 rounded-full hover:bg-brand-hoverStrong"
          title={`Current theme: ${settings?.theme || 'dark'}`}
        >
          {settings?.theme === 'light' ? <Sun size={20} /> : settings?.theme === 'system' ? <Monitor size={20} /> : <Moon size={20} />}
        </button>
        <button className="text-brand-textSecondary hover:text-brand-textMain transition-colors relative p-2 rounded-full hover:bg-brand-hoverStrong">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        <button onClick={onUploadClick} className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Plus size={18} /> <span className="hidden sm:inline">Upload Image</span>
        </button>
      </div>
    </header>
  );
}