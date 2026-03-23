import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from '../UI';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  userName: string;
  rating: number;
  comment: string;
  date: string;
  university?: string;
  isVerified?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  userName, 
  rating, 
  comment, 
  date,
  university,
  isVerified = false,
  className
}) => {
  return (
    <Card className={cn(
      "p-10 space-y-8 border-black/5 bg-paper/20 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all group",
      className
    )}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-2xl shadow-lg group-hover:scale-110 transition-transform">
            {userName[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-ink text-sm uppercase tracking-widest">{userName}</p>
              {isVerified && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold uppercase tracking-tighter">
                  <CheckCircle2 size={10} /> Verified
                </div>
              )}
            </div>
            {university && (
              <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{university}</p>
            )}
            <p className="text-[9px] text-ink/20 font-bold uppercase tracking-widest">{date}</p>
          </div>
        </div>
        <RatingStars rating={rating} size={16} />
      </div>
      
      <div className="relative">
        <span className="absolute -top-4 -left-2 text-6xl text-gold/10 font-serif leading-none">"</span>
        <p className="text-ink/70 text-xl leading-relaxed font-light italic relative z-10">
          {comment}
        </p>
      </div>
    </Card>
  );
};
