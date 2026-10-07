import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-brand-bgCard border-[#10B981] text-brand-textMain' 
          : 'bg-brand-bgError border-[#EF4444] text-brand-textMain'
      }`}>
        {type === 'success' ? <CheckCircle2 className="text-[#10B981]" size={20} /> : <XCircle className="text-[#EF4444]" size={20} />}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-brand-textMain">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}