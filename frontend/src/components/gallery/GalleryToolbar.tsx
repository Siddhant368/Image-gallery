import { LayoutGrid, List, ChevronDown } from 'lucide-react';

interface Props {
  sort: string;
  setSort: (s: string) => void;
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
}

export default function GalleryToolbar({ sort, setSort, view, setView }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <h3 className="text-xl font-bold text-brand-textMain">All Images</h3>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-brand-bgCard border border-brand-border text-brand-textSecondary py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:border-[#10B981] cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none" />
        </div>

        <div className="flex items-center bg-brand-bgCard border border-brand-border rounded-lg p-1">
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-[#10B981] text-white' : 'text-brand-textMuted hover:text-white'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-[#10B981] text-white' : 'text-brand-textMuted hover:text-white'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}