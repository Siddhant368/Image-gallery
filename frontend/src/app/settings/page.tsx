"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Toast, { ToastType } from '../../components/common/Toast';
import { useSettings, UserSettings } from '../../hooks/useSettings';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useImages } from '../../hooks/useImages';
import UploadModal from '../../components/upload/UploadModal';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, isLoaded } = useSettings();
  const [formData, setFormData] = useState<UserSettings | null>(null);
  
  const { search, setSearch, uploadImage } = useImages();
  
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && settings) {
      setFormData(settings);
    }
  }, [isLoaded, settings]);

  const showToast = (message: string, type: ToastType) => {
    if (settings.notifications || type === 'success') {
      setToast({ message, type });
    }
  };

  const handleUpload = async (title: string, file: File) => {
    try {
      await uploadImage(title, file);
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
      throw err;
    }
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = () => {
    if (formData) {
      updateSettings(formData);
      showToast('Settings saved successfully', 'success');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to their defaults?')) {
      resetSettings();
      showToast('Settings reset successfully', 'success');
    }
  };

  if (!isLoaded || !formData) return null;

  return (
    <div className="min-h-screen bg-brand-bgMain flex">
      <Sidebar onUploadClick={() => setIsUploadOpen(true)} />
      
      <main className="flex-1 xl:ml-64 flex flex-col min-h-screen w-full">
        <Topbar 
          searchQuery={search} 
          setSearchQuery={setSearch} 
          onUploadClick={() => setIsUploadOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-textMain mb-2 flex items-center gap-3">
              <Settings className="text-[#10B981]" size={32} />
              Settings
            </h1>
            <p className="text-brand-textSecondary">Manage your profile and application preferences.</p>
          </div>

          <div className="space-y-8 pb-20">
            {/* Profile Section */}
            <div className="bg-brand-bgSecondary border border-brand-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-brand-textMain mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-textSecondary mb-1">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    className="w-full bg-brand-bgCard border border-brand-border rounded-xl px-4 py-2.5 text-brand-textMain focus:outline-none focus:border-[#10B981] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-textSecondary mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-brand-bgCard/50 border border-brand-border rounded-xl px-4 py-2.5 text-brand-textMuted cursor-not-allowed"
                  />
                  <p className="text-xs text-brand-textMuted mt-1">Email cannot be changed.</p>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-brand-bgSecondary border border-brand-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-brand-textMain mb-4">Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-textSecondary mb-2">Theme</label>
                  <div className="flex gap-4">
                    {['dark', 'light', 'system'].map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value={t}
                          checked={formData.theme === t}
                          onChange={(e) => handleChange('theme', e.target.value)}
                          className="text-[#10B981] focus:ring-[#10B981] bg-brand-bgCard border-brand-border"
                        />
                        <span className="text-brand-textMain capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-textSecondary mb-2">Default Gallery View</label>
                  <div className="flex gap-4">
                    {['grid', 'list'].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="galleryView"
                          value={v}
                          checked={formData.galleryView === v}
                          onChange={(e) => handleChange('galleryView', e.target.value)}
                          className="text-[#10B981] focus:ring-[#10B981] bg-brand-bgCard border-brand-border"
                        />
                        <span className="text-brand-textMain capitalize">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-brand-textMain font-medium">Notifications</h3>
                    <p className="text-sm text-brand-textMuted">Enable toast notifications for actions.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.notifications}
                      onChange={(e) => handleChange('notifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-[#173B30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-brand-textMain font-medium">Confirm before deleting</h3>
                    <p className="text-sm text-brand-textMuted">Show a confirmation dialog before deleting images or albums.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.confirmDelete}
                      onChange={(e) => handleChange('confirmDelete', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-[#173B30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors font-medium"
              >
                <RefreshCw size={18} />
                Reset Settings
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl transition-colors font-medium shadow-lg shadow-[#10B981]/20"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
