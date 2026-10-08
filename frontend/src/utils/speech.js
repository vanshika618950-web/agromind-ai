// Robust Browser Web Speech API Utility for AgroMind AI
// Fully supports Telugu (te-IN), Hindi (hi-IN), and English (en-IN)
// Includes Chromium GC preservation, async voice loading, and continuous dictation

export const LANGUAGE_LOCALE_MAP = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

// Check if Text-to-Speech (Synthesis) is supported
export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

// Check if Voice Input (Speech Recognition) is supported
export const isSpeechRecognitionSupported = () => {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
};

// Voice cache management to handle asynchronous voice loading in Chromium/Safari
let cachedVoices = [];

const loadVoices = () => {
  if (!isSpeechSynthesisSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
};

if (typeof window !== 'undefined' && isSpeechSynthesisSupported()) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

// Keep-alive timer for Chromium speech synthesis bug
let speechHeartbeat = null;

const clearSpeechHeartbeat = () => {
  if (speechHeartbeat) {
    clearInterval(speechHeartbeat);
    speechHeartbeat = null;
  }
};

/**
 * Speak text using SpeechSynthesis.
 * Resolves Chromium user-activation drop, GC collection, and audio queue freeze.
 */
export const speak = (text, language = 'en', { onStart, onEnd, onError } = {}) => {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError(new Error('Speech synthesis is not supported on this browser.'));
    return null;
  }

  if (!text || text.trim() === '') return null;

  clearSpeechHeartbeat();

  // Reset any stalled queue
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn('SpeechSynthesis reset warning:', e);
  }

  const targetLocale = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.rate = 0.95; // Natural spoken pace for farmers
  utterance.pitch = 1.0;

  // Find best available voice
  const voices = loadVoices();
  let selectedVoice = null;

  if (voices.length > 0) {
    // 1. Exact locale match (e.g. te-IN, hi-IN, en-IN)
    selectedVoice = voices.find(
      (v) => v.lang && v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase()
    );

    // 2. Base language match (e.g. 'te' or 'hi')
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith(language.toLowerCase())
      );
    }

    // 3. Indian English or Hindi fallback for subcontinental accents
    if (!selectedVoice && language !== 'en') {
      selectedVoice = voices.find(
        (v) => v.lang && (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('hi'))
      );
    }

    // 4. Default system voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.default) || voices[0];
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    // Set utterance lang to voice lang if fallback occurred to prevent OS synthesis failure
    utterance.lang = selectedVoice.lang || targetLocale;
  } else {
    utterance.lang = targetLocale;
  }

  // Prevent Chromium garbage-collection by attaching to window
  window.__agromindActiveUtterance = utterance;

  utterance.onstart = () => {
    // Chrome stops speaking after ~14 seconds unless briefly toggled
    clearSpeechHeartbeat();
    speechHeartbeat = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearSpeechHeartbeat();
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    if (onStart) onStart();
  };

  utterance.onend = () => {
    clearSpeechHeartbeat();
    window.__agromindActiveUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    clearSpeechHeartbeat();
    if (event.error === 'canceled' || event.error === 'interrupted') {
      window.__agromindActiveUtterance = null;
      if (onEnd) onEnd();
      return;
    }
    console.warn('Speech synthesis error event:', event);
    window.__agromindActiveUtterance = null;
    if (onError) onError(event);
  };

  // Speak synchronously to preserve browser user activation
  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Failed to invoke speak synchronously, attempting fallback:', err);
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e2) {
      clearSpeechHeartbeat();
      if (onError) onError(e2);
    }
  }

  return utterance;
};

// Stop speech synthesis immediately
export const stopSpeaking = () => {
  clearSpeechHeartbeat();
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
      window.__agromindActiveUtterance = null;
    } catch (e) {
      console.warn('stopSpeaking error:', e);
    }
  }
};

/**
 * Create SpeechRecognizer instance for microphone input.
 * Supports continuous listening and real-time interim results.
 */
export const createSpeechRecognizer = (language = 'en', { onResult, onError, onEnd }) => {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
  recognition.continuous = true; // Keep listening so farmer can speak at natural pace
  recognition.interimResults = true; // Stream words in real-time as farmer speaks
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    // Aggregate across all speech results in the active session
    for (let i = 0; i < event.results.length; ++i) {
      const item = event.results[i];
      if (item.isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + item[0].transcript;
      } else {
        interimTranscript += (interimTranscript ? ' ' : '') + item[0].transcript;
      }
    }

    const fullTranscript = [finalTranscript, interimTranscript].filter(Boolean).join(' ').trim();

    if (onResult) {
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        fullTranscript,
        combined: fullTranscript,
      });
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
      // benign - farmer paused briefly
      return;
    }
    console.warn('Speech recognition error event:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
};
