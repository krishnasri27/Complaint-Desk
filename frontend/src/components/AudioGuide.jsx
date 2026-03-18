import React, { useState } from 'react';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';

function AudioGuide({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Audio guidance is not supported in this browser.");
    }
  };

  return (
    <button
      onClick={playAudio}
      type="button"
      className={"flex items-center justify-center p-3 rounded-full transition-colors " + (isPlaying ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
      aria-label="Audio Guide"
      title="Play audio instructions"
    >
      {isPlaying ? (
        <HiOutlineSpeakerWave className="w-6 h-6 animate-pulse" />
      ) : (
        <HiOutlineSpeakerXMark className="w-6 h-6" />
      )}
    </button>
  );
}

export default AudioGuide;
