import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AudioGuide from '../components/AudioGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('role', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-center justify-center p-4 md:space-x-8">
      
      {/* Video Demo Section */}
      <div className="w-full md:w-1/2 max-w-lg mb-8 md:mb-0">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('how_to_use', 'How to Use Complaint Desk')}</h2>
        <div className="bg-black w-full aspect-video rounded-2xl shadow-lg flex justify-center items-center overflow-hidden relative">
           <video 
             className="w-full h-full object-cover"
             controls 
             poster="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
           >
             <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
             Your browser does not support HTML video.
           </video>
        </div>
        <p className="mt-4 text-slate-600">Watch this short video to learn how to register, login, and submit a complaint easily.</p>
      </div>

      {/* Login Card */}
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
        <div className="absolute top-6 right-6 flex items-center space-x-2">
          <LanguageSwitcher />
          <AudioGuide text="Welcome to Complaint Desk. Please select if you are a User or Admin. Enter your Email ID, Phone Number, and Password to Login." />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-8">{t('welcome', 'Login')}</h2>
        
        <div className="mb-6 flex space-x-2 p-1 bg-slate-100 rounded-xl">
          <button 
            type="button" 
            onClick={() => setRole('user')} 
            className={"flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors " + (role === 'user' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {t('user', 'User')}
          </button>
          <button 
            type="button" 
            onClick={() => setRole('admin')} 
            className={"flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors " + (role === 'admin' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {t('admin', 'Admin')}
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">{t('email', 'Email ID')}</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-800"
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">{t('phone', 'Phone Number')}</label>
            <input 
              type="tel" 
              required
              className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-800"
              placeholder="+91 99999 99999" 
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">{t('password', 'Password')}</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-800"
              placeholder="••••••••" 
            />
          </div>
          
          <div className="pt-4 space-y-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-2xl"
            >
              {t('login', 'Login')}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 rounded-2xl transition-all text-xl"
            >
              {t('register', 'Register New Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
