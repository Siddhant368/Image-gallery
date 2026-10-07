import { Images } from 'lucide-react';

export default function EmptyGallery({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-brand-border rounded-2xl bg-brand-bgCard/50">
      <div className="w-20 h-20 bg-brand-bgSecondary border border-brand-border rounded-full flex items-center justify-center mb-6 text-[#10B981]">
        <Images size={40} />
      </div>
      <h3 className="text-2xl font-bold text-brand-textMain mb-2">No images yet</h3>
      <p className="text-brand-textSecondary mb-8 max-w-sm">
        Start building your gallery by uploading your first image.
      </p>
      <button onClick={onUpload} className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        + Upload Image
      </button>
    </div>
  );
}