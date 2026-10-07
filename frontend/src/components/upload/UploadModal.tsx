import { CloudUpload, X } from 'lucide-react';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Modal from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setError('');
    setPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateFile = (f: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(f.type)) {
      setError('Unsupported file type. Use JPG, PNG or WEBP.');
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (validateFile(f)) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        if (!title) {
          setTitle(f.name.split('.')[0]);
        }
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (validateFile(f)) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        if (!title) {
          setTitle(f.name.split('.')[0]);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image.');
      return;
    }
    if (!title.trim()) {
      setError('Image title is required.');
      return;
    }
    if (title.length > 100) {
      setError('Title must be less than 100 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onUpload(title, file);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Image">
      <div className="space-y-6">
        {!file ? (
          <div 
            className="border-2 border-dashed border-[#10B981]/40 hover:border-[#10B981] bg-brand-bgMain/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4 text-[#10B981]">
              <CloudUpload size={32} />
            </div>
            <h4 className="text-brand-textMain font-medium mb-1">Drag & drop your image here</h4>
            <p className="text-brand-textMuted text-sm mb-4">or click to browse</p>
            <div className="text-xs text-brand-textMuted bg-brand-bgCard px-3 py-1 rounded-full border border-brand-border">
              JPG, JPEG, PNG, WEBP • Maximum 5MB
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
          </div>
        ) : (
          <div className="bg-brand-bgMain rounded-2xl p-4 border border-brand-border">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-brand-bgSecondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-[#EF4444] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-medium text-brand-textMain truncate mr-4">{file.name}</p>
              <p className="text-xs text-brand-textMuted whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-brand-textSecondary mb-2">Image Title *</label>
          <input 
            type="text" 
            placeholder="Enter image title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full bg-brand-bgMain border border-brand-border rounded-xl px-4 py-3 text-brand-textMain focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {error && <p className="text-[#EF4444] text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button onClick={handleClose} disabled={loading} className="flex-1 px-4 py-3 rounded-xl border border-brand-border text-brand-textSecondary hover:bg-brand-bgCard hover:text-brand-textMain font-medium transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !file} className="flex-1 px-4 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] flex justify-center items-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Upload Image'}
          </button>
        </div>
      </div>
    </Modal>
  );
}