import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiClock, HiExclamationCircle, HiChevronDown, HiChevronUp, HiOutlineShieldExclamation, HiOutlineDocumentText } from 'react-icons/hi2';
import MapPicker from '../components/MapPicker';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AudioGuide from '../components/AudioGuide';

export default function Dashboard() {
  const [expandedIssue, setExpandedIssue] = useState(null);
  const role = localStorage.getItem('role') || 'user';
  
  const mockIssues = [
    { 
      id: 1, 
      complaintId: 'CMP-A91XF',
      title: 'Pothole on Main Street', 
      status: 'Investigation in Progress', 
      isSerious: false, 
      location: {lat: 20.6, lng: 79.0}, 
      locationText: 'Main Street, City Center',
      description: 'A large pothole causing traffic slowdowns and potential accidents.', 
      date: '2026-03-10',
      evidence: ['photo_pothole1.jpg'],
      actions: ['Sent inspector to the site', 'Contacted local municipality']
    },
    { 
      id: 2, 
      complaintId: 'CMP-B72YQ',
      title: 'Harassment at Bus Stop', 
      status: 'Under Review', 
      isSerious: true, 
      location: {lat: 20.7, lng: 78.9}, 
      locationText: 'Sector 4 Bus Stop',
      description: 'Group of individuals harassing passengers waiting for the evening bus.', 
      date: '2026-03-11',
      evidence: ['audio_recording_45.mp3', 'video_evidence.mp4'],
      actions: ['Increased patrol in Sector 4']
    },
    { 
      id: 3, 
      complaintId: 'CMP-C33ZR',
      title: 'Streetlight completely out', 
      status: 'Resolved', 
      isSerious: false, 
      location: {lat: 20.5, lng: 79.1}, 
      locationText: 'Oak Avenue, North District',
      description: 'Intersection is very dark making it unsafe to walk at night.', 
      date: '2026-03-05',
      evidence: [],
      actions: ['Replaced bulb', 'Checked wiring']
    }
  ];

  // Safely find serious issues count
  const seriousIssuesCount = mockIssues?.filter(i => i?.isSerious && i?.status !== 'Resolved')?.length || 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
          <LanguageSwitcher />
          <AudioGuide text={`Dashboard for ${role}. You have ${mockIssues?.length || 0} total complaints. Check the list below for details.`} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">My Dashboard</h2>
          <p className="text-lg text-slate-500 font-medium uppercase tracking-wider mt-1">{role} Portal</p>
        </div>
      </div>

      {role === 'admin' && seriousIssuesCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-sm flex items-start space-x-4 animate-in fade-in slide-in-from-top-4">
          <HiOutlineShieldExclamation className="w-8 h-8 text-red-600 flex-shrink-0 mt-1 animate-pulse" />
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-1">Serious Issue Alert</h3>
            <p className="text-red-700 font-medium">There are <strong className="text-2xl">{seriousIssuesCount}</strong> high-priority complaints requiring immediate admin attention. Please review the highlighted tickets below.</p>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex items-center space-x-5 transition-transform hover:scale-105">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><HiClock className="w-8 h-8" /></div>
          <div><p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Active</p><p className="text-4xl font-extrabold text-slate-800">{mockIssues?.filter(i=>i?.status!=='Resolved')?.length || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex items-center space-x-5 transition-transform hover:scale-105">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600"><HiCheckCircle className="w-8 h-8" /></div>
          <div><p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Resolved</p><p className="text-4xl font-extrabold text-slate-800">{mockIssues?.filter(i=>i?.status==='Resolved')?.length || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex items-center space-x-5 transition-transform hover:scale-105">
          <div className="bg-red-100 p-4 rounded-2xl text-red-600"><HiExclamationCircle className="w-8 h-8" /></div>
          <div><p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Serious</p><p className="text-4xl font-extrabold text-slate-800">{seriousIssuesCount}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-2xl font-extrabold text-slate-800">Recent Reports</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {(!mockIssues || mockIssues.length === 0) ? (
            <div className="p-8 text-center">
              <p className="text-xl text-slate-500 font-medium">No issues found.</p>
            </div>
          ) : (
            mockIssues.map(issue => (
              <div key={issue?.id} className={`transition-colors ${expandedIssue === issue?.id ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}>
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer" onClick={() => setExpandedIssue(expandedIssue === issue?.id ? null : issue?.id)}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-bold text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-md">{issue?.complaintId}</span>
                      <span className="text-sm font-semibold text-slate-500">{issue?.date}</span>
                      {issue?.isSerious && <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-extrabold tracking-widest uppercase">PRIORITY</span>}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">{issue?.title}</h4>
                    <p className={`inline-block mt-2 font-bold px-3 py-1 rounded-full text-sm ${
                      issue?.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      issue?.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue?.status}
                    </p>
                  </div>
                  <button className="mt-4 md:mt-0 p-3 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm hover:text-blue-600 hover:border-blue-300 transition-colors">
                    {expandedIssue === issue?.id ? <HiChevronUp className="w-6 h-6"/> : <HiChevronDown className="w-6 h-6"/>}
                  </button>
                </div>
                
                {expandedIssue === issue?.id && (
                  <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Details Column */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Description</h5>
                        <p className="text-slate-800 text-lg mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">{issue?.description}</p>
                        
                        <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence Files</h5>
                        {issue?.evidence?.length > 0 ? (
                          <div className="space-y-2 mb-6">
                            {issue.evidence.map((file, idx) => (
                              <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                <HiOutlineDocumentText className="w-6 h-6 text-blue-500" />
                                <span className="text-slate-700 font-medium">{file}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 italic mb-6">No evidence files provided.</p>
                        )}

                        {issue?.actions?.length > 0 && (
                          <>
                            <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Related Actions</h5>
                            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              {issue.actions.map((act, idx) => <li key={idx}>{act}</li>)}
                            </ul>
                          </>
                        )}

                        {role === 'admin' && issue?.status !== 'Resolved' && (
                          <div className="mt-8">
                            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all">
                              Update Status
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Location Column */}
                      <div>
                        <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Incident Location</h5>
                        <p className="text-slate-800 font-semibold mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">{issue?.locationText}</p>
                        <div className="h-64 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                           <MapPicker onLocationSelect={()=>{}} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
