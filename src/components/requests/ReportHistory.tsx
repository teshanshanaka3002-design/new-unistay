import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { Card, Badge, Modal, Button } from '../UI';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, ChevronRight, Image as ImageIcon } from 'lucide-react';

export const ReportHistory: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await reportService.getStudentReports();
            setReports(res.data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/30">Loading your history...</p>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <Card className="p-20 text-center space-y-6 border-black/5 rounded-[3rem] bg-white/50 backdrop-blur-xl">
                <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mx-auto text-ink/10">
                    <MessageSquare size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-ink">No Reports Found</h3>
                    <p className="text-ink/40 max-w-xs mx-auto text-sm">You haven't submitted any issue reports yet. Your history will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
                {reports.map((report, idx) => (
                    <motion.div
                        key={report._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card 
                            onClick={() => setSelectedReport(report)}
                            className="p-8 border-black/5 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer group bg-white/80 backdrop-blur-xl rounded-[2.5rem]"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${
                                        report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                                    }`}>
                                        {report.status === 'Resolved' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-serif text-ink group-hover:text-gold transition-colors">{report.title}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-ink/30">
                                            <Clock size={12} />
                                            {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            <span className="opacity-30">•</span>
                                            <span className={report.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 self-end md:self-center">
                                    {report.replies?.length > 0 && (
                                        <Badge className="bg-gold/10 text-gold border-gold/20 text-[9px]">
                                            {report.replies.length} {report.replies.length === 1 ? 'Reply' : 'Replies'}
                                        </Badge>
                                    )}
                                    <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink/20 group-hover:text-gold group-hover:bg-gold/5 transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                title={selectedReport?.title || 'Report Details'}
                maxWidth="3xl"
            >
                {selectedReport && (
                    <div className="space-y-10 p-2">
                        {/* Issue Details */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Issue Description</p>
                                    <p className="text-lg text-ink/70 leading-relaxed font-medium">{selectedReport.description}</p>
                                </div>
                                <Badge className={selectedReport.status === 'Resolved' ? 'bg-emerald-500 text-white border-0' : 'bg-amber-500 text-white border-0'}>
                                    {selectedReport.status}
                                </Badge>
                            </div>

                            {selectedReport.images?.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Evidence / Images</p>
                                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                        {selectedReport.images.map((img: string, i: number) => (
                                            <div key={i} className="w-32 h-32 rounded-2xl overflow-hidden border border-black/5 bg-paper shrink-0 group">
                                                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Admin Conversation */}
                        <div className="pt-10 border-t border-black/5 space-y-8">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={18} className="text-gold" />
                                <h4 className="text-xl font-serif text-ink">Communication Log</h4>
                            </div>

                            <div className="space-y-6">
                                {selectedReport.replies?.length > 0 ? (
                                    selectedReport.replies.map((reply: any, i: number) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                                <ImageIcon size={18} />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-bold text-ink">{reply.adminName} <span className="text-ink/30 font-medium ml-2">Official Reply</span></p>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/20">
                                                        {new Date(reply.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                                <div className="p-6 rounded-3xl rounded-tl-none bg-paper/50 text-ink/70 text-sm leading-relaxed border border-black/5 italic">
                                                    "{reply.message}"
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 rounded-[2.5rem] bg-paper/30 border border-dashed border-black/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Awaiting administrative response...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setSelectedReport(null)} className="rounded-full px-10">Close Details</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
