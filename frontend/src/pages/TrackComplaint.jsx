import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineClock, HiOutlineDocumentSearch } from 'react-icons/hi2';
import AudioGuide from '../components/AudioGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function TrackComplaint() {
  const { t } = useTranslation();
  const [complaintId, setComplaintId] = useState('');
  const [status, setStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!complaintId) return;
    
    // Simulate API fetch based on ID ending
    let statusId = 1;
    if (complaintId.endsWith('2')) statusId = 2;
    if (complaintId.endsWith('3')) statusId = 3;
    if (complaintId.endsWith('4')) statusId = 4;
    
    setStatus(statusId);
  };

  const steps = [
    { id: 1, name: 'Submitted', description: 'Your complaint has been received.', icon: HiOutlineDocumentSearch },
    { id: 2, name: 'Under Review', description: 'Authorities are reviewing the details.', icon: HiOutlineClock },
    { id: 3, name: 'Investigation in Progress', description: 'Action is currently being taken.', icon: HiOutlineMagnifyingGlass },
    { id: 4, name: 'Resolved', description: 'The issue has been successfully resolved.', icon: HiOutlineCheckCircle },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl mt-12 border border-slate-100 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
          <LanguageSwitcher />
          <AudioGuide text="Track your complaint status. Enter your unique complaint ID in the search box to see the progress of your issue." />
      </div>

      <div className="mb-10 mt-4">
        <h2 className="text-3xl font-extrabold text-slate-800">{t('track_complaint', 'Track Your Complaint')}</h2>
        <p className="text-lg text-slate-500 mt-2">Enter your Complaint ID to check its current status.</p>
      </div>

      <form onSubmit={handleTrack} className="flex space-x-4 mb-12">
        <input 
          type="text" 
          required
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          className="flex-1 px-6 py-5 text-xl font-mono rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all placeholder-slate-400 text-slate-700"
          placeholder="e.g. CMP-X9F2A1"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-5 rounded-2xl shadow-lg transition-colors text-xl flex items-center">
          <HiOutlineMagnifyingGlass className="w-6 h-6 mr-2" /> Track
        </button>
      </form>

      {status && (
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Status Timeline</h3>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 rounded-full hidden md:block"></div>

            <div className="space-y-8">
              {steps.map((step) => {
                const isCompleted = status >= step.id;
                const isCurrent = status === step.id;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="relative flex items-start md:items-center space-x-6">
                    
                    {/* Status Icon */}
                    <div className={"z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-sm border-4 transition-colors " + (isCompleted ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-slate-100 text-slate-400')}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <div className={"flex-1 p-6 rounded-2xl border transition-all " + (isCurrent ? 'bg-white border-primary-200 shadow-md ring-2 ring-primary-50' : isCompleted ? 'bg-white border-slate-200' : 'bg-transparent border-transparent opacity-50')}>
                      <h4 className={"text-xl font-bold " + (isCurrent ? 'text-primary-700' : isCompleted ? 'text-slate-800' : 'text-slate-500')}>{step.name}</h4>
                      <p className="text-slate-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
