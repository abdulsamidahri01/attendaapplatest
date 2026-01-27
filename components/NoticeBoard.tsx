
import React from 'react';
// Fix: Changed NOTICES to SEED_NOTICES as per constants.tsx exports
import { SEED_NOTICES as DEFAULT_NOTICES } from '../constants';
import { Pin } from 'lucide-react';
import { Notice } from '../types';

interface NoticeBoardProps {
  notices?: Notice[];
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices }) => {
  const displayNotices = notices || DEFAULT_NOTICES;

  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] h-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Pin size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Notice Board</h3>
      </div>
      
      <div className="space-y-4">
        {displayNotices.slice(0, 5).map((notice) => (
          <div key={notice.id} className="relative border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-indigo-600 font-medium bg-white px-2 py-0.5 rounded-full">{notice.type}</span>
              <span className="text-xs text-gray-500">{notice.date}</span>
            </div>
          </div>
        ))}
        {displayNotices.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No notices available.</p>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
