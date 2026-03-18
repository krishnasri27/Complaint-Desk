import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AudioGuide from '../components/AudioGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl mt-12 border border-slate-100 relative">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
          <LanguageSwitcher />
          <AudioGuide text="Create a new account. Enter your full name, email address, phone number, and password below." />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mt-6 mb-8">{t('register', 'Register New Account')}</h2>
      
      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <label className="block text-lg font-semibold text-slate-700 mb-2">Full Name</label>
          <input 
            type="text" 
            required
            className="w-full px-5 py-4 text-lg rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-slate-800"
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-slate-700 mb-2">{t('email', 'Email Address')}</label>
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
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-2xl"
          >
            Create Account
          </button>
        </div>
      </form>
      
      <p className="mt-8 text-center text-slate-600 text-lg">
        Already have an account? <Link to="/" className="text-primary-600 font-bold hover:underline">{t('login', 'Login here')}</Link>
      </p>
    </div>
  );
}
