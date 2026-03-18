import React from 'react';
import { HiSpeakerWave } from 'react-icons/hi2';

export default function SpeechSpeaker({ text }) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      type="button"
      onClick={speak}
      className="p-2 text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full transition-colors inline-flex items-center justify-center"
      aria-label="Read aloud"
      title="Read text aloud"
    >
      <HiSpeakerWave className="w-6 h-6" />
    </button>
  );
}
