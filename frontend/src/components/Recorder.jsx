import React, { useState, useRef } from 'react';
import { HiMicrophone, HiStop } from 'react-icons/hi2';

export default function Recorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        audioChunksRef.current = []; // Reset
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-xl bg-slate-50 border-slate-200">
      {!isRecording ? (
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-md font-medium text-lg focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all"
        >
          <HiMicrophone className="w-6 h-6" />
          <span>Hold to Record</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center justify-center space-x-2 bg-error hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md font-medium text-lg focus:outline-none focus:ring-4 focus:ring-red-300 animate-pulse transition-all"
        >
          <HiStop className="w-6 h-6" />
          <span>Stop Recording</span>
        </button>
      )}
    </div>
  );
}
