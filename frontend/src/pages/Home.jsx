import React from 'react';
import { Link } from 'react-router-dom';
import { HiSpeakerWave, HiPencilSquare, HiUserGroup, HiShieldCheck } from 'react-icons/hi2';
import SpeechSpeaker from '../components/SpeechSpeaker';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Complaint Desk
          <SpeechSpeaker text="Welcome to Complaint Desk. A free and accessible platform to submit your complaints and issues." />
        </h1>
        <p className="text-xl text-slate-600">
          A free, open-source platform making it easy for everyone to submit and track their issues.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <Link to="/submit" className="group relative bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4">
          <div className="bg-primary-50 p-6 rounded-full group-hover:bg-primary-100 transition-colors">
            <HiPencilSquare className="w-12 h-12 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Submit a Complaint</h2>
            <p className="text-slate-500 mt-2">Record audio, use the map, or type your issue.</p>
          </div>
        </Link>

        <Link to="/login" className="group relative bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-secondary-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4">
          <div className="bg-secondary-50 p-6 rounded-full group-hover:bg-secondary-100 transition-colors">
            <HiUserGroup className="w-12 h-12 text-secondary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Track or Manage</h2>
            <p className="text-slate-500 mt-2">Login to view status or enter admin dashboard.</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-2 text-slate-400 mt-8">
        <HiShieldCheck className="w-5 h-5" />
        <span>Secure, Free & Accessible</span>
      </div>
    </div>
  );
}
