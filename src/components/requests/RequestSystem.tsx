import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccommodationRequestForm } from './AccommodationRequestForm';
import { IssueReportForm } from './IssueReportForm';
import { ReportHistory } from './ReportHistory';
import { Card } from '../UI';
import { Home, AlertTriangle, ChevronRight, MessageCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'issue' | 'history';

export const RequestSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('issue');

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif text-ink">Support & Assistance</h2>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/30">Track your reports and communicate with administration</p>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-paper/50 rounded-[2.5rem] border border-black/5 backdrop-blur-sm sticky top-8 z-20">
        <button
          onClick={() => setActiveTab('issue')}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-xs font-bold uppercase tracking-widest transition-all duration-500",
            activeTab === 'issue' 
              ? "bg-white text-ink shadow-xl shadow-black/5" 
              : "text-ink/40 hover:text-ink/60"
          )}
        >
          <AlertTriangle size={18} className={activeTab === 'issue' ? "text-red-500" : ""} />
          Report New Issue
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-xs font-bold uppercase tracking-widest transition-all duration-500",
            activeTab === 'history' 
              ? "bg-white text-ink shadow-xl shadow-black/5" 
              : "text-ink/40 hover:text-ink/60"
          )}
        >
          <MessageCircle size={18} className={activeTab === 'history' ? "text-gold" : ""} />
          My Reports & History
        </button>
      </div>

      {/* Form Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {activeTab === 'issue' ? (
            <Card className="p-12 md:p-16 border-black/5 shadow-2xl shadow-black/5 rounded-[3.5rem] bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-ink/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-red-500 shadow-lg shadow-red-500/20">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif text-ink">Submit Issue Report</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/30">Describe the problem for immediate attention</p>
                    </div>
                  </div>
                </div>
                <IssueReportForm />
              </div>
            </Card>
          ) : (
            <ReportHistory />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Help Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[2.5rem] bg-ink text-white shadow-2xl shadow-ink/20">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-gold font-bold uppercase tracking-widest text-[10px]">Need immediate help?</p>
          <h4 className="text-2xl font-serif">Contact Student Support</h4>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-all group backdrop-blur-md border border-white/10">
          Chat with us
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
