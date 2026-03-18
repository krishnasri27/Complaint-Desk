/**
 * Complaint Desk – Speech Utility
 * Provides click-to-hear audio guidance using the Web Speech API.
 */
export const speak = (text, lang = "en-US") => {
  if (!("speechSynthesis" in window)) return;
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = lang;
  msg.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
};
