import React from 'react';
import { X, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { Modal, Button } from '../UI';
import { Accommodation } from '../../types/accommodation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, accommodation }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-8 py-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif text-ink">Contact Owner</h2>
            <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">
              Listing: {accommodation.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-ink/40 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-paper/30 border border-black/5">
          <div className="w-16 h-16 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-2xl">
            {accommodation.ownerName?.[0] || 'O'}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-ink">{accommodation.ownerName || 'Property Owner'}</h3>
            <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">Verified Host</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-black/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-ink">{accommodation.ownerPhone || '+94 77 123 4567'}</p>
              </div>
            </div>
            <a 
              href={`tel:${accommodation.ownerPhone || '+94771234567'}`}
              className="p-3 rounded-xl bg-paper text-ink/40 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <ExternalLink size={18} />
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-black/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">WhatsApp</p>
                <p className="font-bold text-ink">Chat with Owner</p>
              </div>
            </div>
            <a 
              href={`https://wa.me/${(accommodation.ownerPhone || '94771234567').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-paper text-ink/40 hover:bg-emerald-600 hover:text-white transition-all"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-black/5">
          <Button 
            onClick={onClose}
            className="w-full h-14 rounded-xl bg-ink text-white font-bold uppercase text-xs tracking-widest"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
