import React from 'react';
import { School } from 'lucide-react';

interface UniversityFilterBarProps {
  selectedUniversity: string;
  onUniversityChange: (university: string) => void;
}

const UNIVERSITIES = ['All', 'SLIIT', 'NSBM', 'IIT', 'CINEC'];

export const UniversityFilterBar: React.FC<UniversityFilterBarProps> = ({
  selectedUniversity,
  onUniversityChange,
}) => {
  return (
    <div className="bg-white border-b border-black/5 sticky top-0 z-30 overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <div className="flex items-center gap-2 text-ink/40 mr-4 shrink-0">
          <School size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">University</span>
        </div>
        <div className="flex gap-2">
          {UNIVERSITIES.map((uni) => (
            <button
              key={uni}
              onClick={() => onUniversityChange(uni)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedUniversity === uni
                  ? 'bg-ink text-white border-ink'
                  : 'bg-paper text-ink/60 border-black/5 hover:border-ink/20'
              }`}
            >
              {uni}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
