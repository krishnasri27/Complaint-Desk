import React, { useState } from 'react';
import Recorder from '../components/Recorder';
import MapPicker from '../components/MapPicker';
import AudioGuide from '../components/AudioGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { HiOutlineCheckCircle, HiOutlinePaperClip, HiOutlineMapPin } from 'react-icons/hi2';

export default function SubmitComplaint() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [complaintId, setComplaintId] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    city: '',
    area: '',
    landmark: '',
    location: null,
    files: []
  });

  const handleRecordingComplete = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
  };

  const handleManualLocationChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData, 
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
        alert("Location detected: " + pos.coords.latitude + ", " + pos.coords.longitude);
      }, () => {
        alert("Unable to retrieve your location. Please check browser permissions.");
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const submitFinal = () => {
    const randomId = "CMP-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setComplaintId(randomId);
    setStep(4);
  };

  const getAudioGuideText = () => {
    switch(step) {
      case 1: return "Step 1. What is the issue? Please provide a title, category, and description. You can also record a voice message if you prefer.";
      case 2: return "Step 2. Where did this happen? Enter the city, area, and landmark, or use the exact map location.";
      case 3: return "Step 3. Upload Evidence. Add any photos, video, audio, or document files here, then click Final Submit.";
      case 4: return "Success! Your complaint has been submitted. Note down your unique complaint ID.";
      default: return "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-xl mt-8 border border-slate-100 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
          <LanguageSwitcher />
          <AudioGuide text={getAudioGuideText()} />
      </div>
      
      <div className="mb-8 mt-4">
        <h2 className="text-3xl font-extrabold text-slate-800">{t('submit_complaint', 'Report an Issue')}</h2>
        {step < 4 && <p className="text-primary-600 font-semibold mt-2">Step {step} of 3</p>}
      </div>

      <div className="space-y-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div>
               <label className="block text-lg font-semibold text-slate-700 mb-2">Complaint Title</label>
               <input 
                 type="text" 
                 className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 shadow-sm transition-all text-slate-800"
                 placeholder="Example: Pothole on Main Street" 
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-lg font-semibold text-slate-700 mb-2">Category</label>
               <select 
                 className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 shadow-sm transition-all text-slate-800"
                 value={formData.category}
                 onChange={(e) => setFormData({...formData, category: e.target.value})}
               >
                 <option value="">Select Category...</option>
                 <option value="harassment">Harassment</option>
                 <option value="violence">Violence</option>
                 <option value="theft">Theft / Robbery</option>
                 <option value="infrastructure">Infrastructure / Public Issue</option>
                 <option value="other">Other</option>
               </select>
             </div>
             <div>
               <label className="block text-lg font-semibold text-slate-700 mb-2">Description</label>
               <textarea 
                 rows="4" 
                 className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 shadow-sm transition-all text-slate-800"
                 placeholder="Describe the incident in detail..."
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
               ></textarea>
             </div>

             <div className="py-6 px-6 bg-slate-50 rounded-2xl border border-slate-200">
               <p className="text-md font-bold text-slate-700 mb-4 tracking-wide">CANNOT TYPE WELL? RECORD YOUR VOICE ISSUE</p>
               <Recorder onRecordingComplete={handleRecordingComplete} />
               {audioUrl && (
                 <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <p className="text-sm font-semibold text-primary-700 mb-2">Recorded Voice Complaint:</p>
                   <audio src={audioUrl} controls className="w-full" />
                 </div>
               )}
             </div>

             <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-2xl shadow-lg transition-colors text-xl mt-8">Continue to Location</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                 <label className="block text-lg font-semibold text-slate-700 mb-2">City</label>
                 <input type="text" name="city" value={formData.city} onChange={handleManualLocationChange} className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 transition-all text-slate-800" placeholder="e.g. Mumbai" />
               </div>
               <div>
                 <label className="block text-lg font-semibold text-slate-700 mb-2">Area</label>
                 <input type="text" name="area" value={formData.area} onChange={handleManualLocationChange} className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 transition-all text-slate-800" placeholder="e.g. Andheri West" />
               </div>
               <div className="md:col-span-2">
                 <label className="block text-lg font-semibold text-slate-700 mb-2">Landmark</label>
                 <input type="text" name="landmark" value={formData.landmark} onChange={handleManualLocationChange} className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 transition-all text-slate-800" placeholder="e.g. Near St. Mary's School" />
               </div>
             </div>

             <div className="py-6 px-6 bg-slate-50 rounded-2xl border border-slate-200">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                 <p className="text-md font-bold text-slate-700 tracking-wide">EXACT LOCATION (OPTIONAL)</p>
                 <button onClick={detectLocation} className="mt-2 sm:mt-0 flex items-center bg-white border border-slate-300 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold transition-colors">
                   <HiOutlineMapPin className="w-5 h-5 mr-2 text-primary-600" /> Detect GPS Location
                 </button>
               </div>
               <MapPicker onLocationSelect={(pos) => setFormData({...formData, location: pos})} />
             </div>

             <div className="flex space-x-4 mt-8">
               <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 rounded-2xl shadow-sm transition-colors text-xl">Back</button>
               <button onClick={() => setStep(3)} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-2xl shadow-lg transition-colors text-xl">Continue to Evidence</button>
             </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             
             <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
               <p className="text-lg font-semibold text-slate-800 mb-4">Upload Additional Proof (Images, Video, Documents)</p>
               <div className="border-2 border-dashed border-primary-300 rounded-2xl p-12 text-center hover:bg-primary-50 transition-colors cursor-pointer relative overflow-hidden bg-white">
                 <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                   if (e.target.files && e.target.files.length > 0) {
                     alert('File attached: ' + e.target.files[0].name);
                   }
                 }}/>
                 <HiOutlinePaperClip className="w-12 h-12 mx-auto text-primary-400 mb-4" />
                 <p className="text-primary-700 font-semibold text-xl">Tap here to Select Files</p>
                 <p className="text-slate-500 font-medium mt-2">Supports .jpg, .png, .mp4, .pdf</p>
               </div>
             </div>

             <div className="flex space-x-4 mt-8">
               <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 rounded-2xl shadow-sm transition-colors text-xl">Back</button>
               <button onClick={submitFinal} className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 rounded-2xl shadow-lg transition-colors text-xl">Final Submit</button>
             </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="text-center py-12 animate-in zoom-in-95 duration-500">
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-6">
               <HiOutlineCheckCircle className="w-16 h-16" />
             </div>
             <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Complaint Submitted!</h2>
             <p className="text-xl text-slate-600 mb-8">Your report has been successfully recorded. Authorities will review it shortly.</p>
             
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 max-w-sm mx-auto mb-10">
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Your Unique tracking ID</p>
               <p className="text-3xl font-mono font-bold text-primary-700">{complaintId}</p>
             </div>

             <div className="space-x-4">
               <button onClick={() => window.location.href='/track'} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-colors text-lg">
                 Track Status
               </button>
               <button onClick={() => window.location.href='/dashboard'} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-xl shadow-md transition-colors text-lg">
                 Go Home
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
