export default function ImageSkeleton({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 bg-brand-bgCard border border-brand-border p-4 rounded-xl animate-pulse">
        <div className="w-24 h-24 bg-[#173B30] rounded-lg shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-[#173B30] rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-[#173B30] rounded w-1/4"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bgCard border border-brand-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-[#173B30]"></div>
      <div className="p-4">
        <div className="h-5 bg-[#173B30] rounded w-3/4 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#173B30] rounded w-1/3"></div>
          <div className="w-8 h-8 rounded-full bg-[#173B30]"></div>
        </div>
      </div>
    </div>
  );
}