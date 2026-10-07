export default function CategoryFilters() {
  const categories = ['All', 'Nature', 'Travel', 'Architecture', 'Animals', 'Cars', 'People', 'Other'];
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat, i) => (
        <button
          key={cat}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            i === 0 
              ? 'bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-[#10B981]' 
              : 'bg-brand-bgCard text-brand-textSecondary border border-brand-border hover:border-[#10B981] hover:text-brand-textMain'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}