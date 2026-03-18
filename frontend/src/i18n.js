import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Complaint Desk',
          login: 'Login',
          register: 'Register',
          email: 'Email ID',
          phone: 'Phone Number',
          password: 'Password',
          user: 'User',
          admin: 'Admin',
          submit_complaint: 'Submit a Complaint',
          track_complaint: 'Track Complaint',
          role_switch: 'Select Role'
        }
      },
      hi: {
        translation: {
          welcome: 'कम्प्लेंट डेस्क में आपका स्वागत है',
          login: 'लॉग इन करें',
          register: 'रजिस्टर करें',
          email: 'ईमेल आईडी',
          phone: 'फ़ोन नंबर',
          password: 'पासवर्ड',
          user: 'उपयोगकर्ता',
          admin: 'व्यवस्थापक',
          submit_complaint: 'शिकायत दर्ज करें',
          track_complaint: 'शिकायत ट्रैक करें',
          role_switch: 'भूमिका चुनें'
        }
      },
      te: {
        translation: {
          welcome: 'కంప్లైంట్ డెస్క్‌కు స్వాగతం',
          login: 'లాగిన్',
          register: 'నమోదు చేయండి',
          email: 'ఈమెయిల్ ID',
          phone: 'ఫోన్ నంబర్',
          password: 'పాస్‌వర్డ్',
          user: 'వినియోగదారు',
          admin: 'అడ్మిన్',
          submit_complaint: 'ఫిర్యాదు చేయండి',
          track_complaint: 'ఫిర్యాదు ట్రాక్ చేయండి',
          role_switch: 'పాత్రను ఎంచుకోండి'
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
