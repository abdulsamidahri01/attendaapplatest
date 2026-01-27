
import React, { useState } from 'react';
import { X, Building, Phone, Mail, MapPin, User, Save, Edit3 } from 'lucide-react';
import { SchoolConfig, DepartmentDetails } from '../types';

interface DepartmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
  onUpdate: (updatedConfig: SchoolConfig) => void;
  isAdmin: boolean;
}

const DepartmentInfoModal: React.FC<DepartmentInfoModalProps> = ({ 
  isOpen, onClose, config, onUpdate, isAdmin 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SchoolConfig>(config);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'departmentName') {
      setFormData(prev => ({ ...prev, departmentName: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        departmentDetails: {
          ...(prev.departmentDetails || { phone: '', email: '', location: '', headOfDept: '' }),
          [field]: value
        }
      }));
    }
  };

  const details = formData.departmentDetails || { 
    phone: 'Not provided', 
    email: 'Not provided', 
    location: 'Not provided', 
    headOfDept: 'Not provided' 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building size={24} />
            <h2 className="text-xl font-bold">Department Info</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Main Name Display */}
          <div className="text-center pb-4 border-b border-gray-100">
            {isEditing ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left block">Department Name</label>
                <input 
                  value={formData.departmentName}
                  onChange={(e) => handleChange('departmentName', e.target.value)}
                  className="w-full text-center text-lg font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-blue-50/50 py-1"
                />
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{config.departmentName}</h3>
            )}
          </div>

          <div className="space-y-5">
            {/* Info Items */}
            <InfoItem 
              icon={User} 
              label="Head of Department" 
              value={details.headOfDept} 
              isEditing={isEditing}
              onChange={(val) => handleChange('headOfDept', val)}
            />
            <InfoItem 
              icon={Phone} 
              label="Phone Number" 
              value={details.phone} 
              isEditing={isEditing}
              onChange={(val) => handleChange('phone', val)}
            />
            <InfoItem 
              icon={Mail} 
              label="Email Address" 
              value={details.email} 
              isEditing={isEditing}
              onChange={(val) => handleChange('email', val)}
            />
            <InfoItem 
              icon={MapPin} 
              label="Location / Office" 
              value={details.location} 
              isEditing={isEditing}
              onChange={(val) => handleChange('location', val)}
            />
          </div>
        </div>

        {/* Footer */}
        {isAdmin && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-md"
                >
                  <Save size={16} /> Save Details
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-black shadow-md"
              >
                <Edit3 size={16} /> Edit Information
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, isEditing, onChange }: any) => (
  <div className="flex items-start gap-4 group">
    <div className="p-2.5 bg-gray-50 text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      {isEditing ? (
        <input 
          value={value === 'Not provided' ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
          className="w-full text-sm font-medium text-gray-800 focus:outline-none border-b border-gray-200 focus:border-blue-500 py-0.5"
        />
      ) : (
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      )}
    </div>
  </div>
);

export default DepartmentInfoModal;
