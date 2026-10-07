import { Image as ImageIcon, Cloud, ShieldCheck } from 'lucide-react';
import { formatBytes } from '../../utils/format';

export default function HeroSection({ totalImages, onUpload }: { totalImages: number, onUpload: () => void }) {
  // Assuming average 2MB per image if no size provided
  const estimatedSize = totalImages * 2 * 1024 * 1024; 
  
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-brand-bgCard border border-brand-border">
      <div className="absolute inset-0 bg-gradient-to-r from-[#03110D]/95 via-[#03110D]/80 to-transparent z-10"></div>
      
      {/* Background decoration - normally an image, but using CSS gradient to keep it self-contained */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] to-[#03110D] opacity-40"></div>
      
      <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <p className="text-[#10B981] font-semibold text-sm tracking-wider uppercase mb-2">Welcome to Image Gallery</p>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-textMain mb-4 leading-tight">
            Discover <span className="text-[#10B981]">Beautiful</span> Moments
          </h2>
          <p className="text-brand-textSecondary text-lg mb-8 max-w-md leading-relaxed">
            Your personal space to store, organize and manage your favorite images.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onUpload} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              + Upload Image
            </button>
            <button className="bg-transparent border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 px-6 py-3 rounded-xl font-medium transition-colors">
              Explore Gallery
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="bg-brand-bgMain/60 backdrop-blur-md border border-brand-border p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-textMain">{totalImages}</p>
              <p className="text-xs text-brand-textMuted uppercase tracking-wider">Total Images</p>
            </div>
          </div>
          
          <div className="bg-brand-bgMain/60 backdrop-blur-md border border-brand-border p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-textMain">{formatBytes(estimatedSize)}</p>
              <p className="text-xs text-brand-textMuted uppercase tracking-wider">Storage Used</p>
            </div>
          </div>

          <div className="bg-brand-bgMain/60 backdrop-blur-md border border-brand-border p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-[#10B981] flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-textMain">100%</p>
              <p className="text-xs text-brand-textMuted uppercase tracking-wider">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}