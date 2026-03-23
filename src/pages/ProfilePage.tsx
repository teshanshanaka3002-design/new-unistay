import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileForm } from '../components/profile/ProfileForm';
import { Card } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Camera, Mail, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-serif text-ink">My Profile</h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/30">Manage your personal information</p>
      </div>

      {/* User Summary Card */}
      <Card className="p-12 md:p-16 border-black/5 shadow-2xl shadow-black/5 rounded-[3.5rem] bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-ink/5 rounded-full -ml-40 -mb-40 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full bg-paper border-4 border-white shadow-2xl flex items-center justify-center text-ink/20 font-serif text-6xl font-bold overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0)
              )}
            </div>
            <button className="absolute bottom-2 right-2 w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white">
              <Camera size={20} />
            </button>
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif text-ink">{user?.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-paper rounded-full text-xs font-bold uppercase tracking-widest text-ink/40">
                  <Mail size={14} className="text-gold" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-xs font-bold uppercase tracking-widest text-gold">
                  <ShieldCheck size={14} />
                  {user?.role.replace('_', ' ')}
                </div>
              </div>
            </div>
            <p className="text-ink/40 text-sm max-w-md">
              Welcome to your UniStay profile. Here you can update your personal details, manage your account settings, and track your activity across the platform.
            </p>
          </div>
        </div>
      </Card>

      {/* Details Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-ink">Personal Details</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Your account information</p>
          </div>
        </div>

        <Card className="p-10 md:p-12 border-black/5 shadow-xl shadow-black/5 rounded-[3rem] bg-white">
          <ProfileForm isEditing={isEditing} setIsEditing={setIsEditing} />
        </Card>
      </div>

      {/* Security Info Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[2.5rem] bg-ink text-white shadow-2xl shadow-ink/20">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-gold font-bold uppercase tracking-widest text-[10px]">Your data is secure</p>
          <h4 className="text-2xl font-serif">Privacy & Security</h4>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Last Updated</p>
            <p className="text-sm font-medium">Today, 15:40</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Status</p>
            <div className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
