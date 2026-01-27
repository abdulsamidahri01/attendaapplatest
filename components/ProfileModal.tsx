import React, { useRef } from 'react';
import { X, Camera, User, Upload } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
  userImage?: string;
  onUploadImage: (file: File) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, onClose, userName, userRole, userImage, onUploadImage 
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-[#5e81f4] to-[#7191f6] h-24 w-full absolute top-0 left-0"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="pt-12 pb-8 px-6 flex flex-col items-center relative z-0 mt-2">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center relative bg-white">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <User size={48} className="text-gray-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <div className="absolute bottom-1 right-1 bg-[#5e81f4] p-2 rounded-full text-white border-2 border-white shadow-sm pointer-events-none">
                <Upload size={14} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />

          <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">{userName}</h3>
          <p className="text-sm font-medium text-[#5e81f4] mt-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {userRole}
          </p>

          <p className="text-xs text-gray-400 mt-6 text-center max-w-[200px] leading-relaxed">
            Click on the profile picture to upload a new photo. Recommended size: 500x500px.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;