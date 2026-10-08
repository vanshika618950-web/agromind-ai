import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  AlertCircle,
  Sparkles,
  Layers,
  Brain,
  ShieldCheck,
  CalendarCheck2,
  CheckCircle2,
  Zap,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  X,
  Volume2,
  Square,
  RefreshCw,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { advisoryApi } from '../services/advisoryApi';
import AIProcessingModal from '../components/AIProcessingModal';
import { useLanguage } from '../context/LanguageContext';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speak,
  stopSpeaking,
  isSpeechSynthesisSupported,
} from '../utils/speech';

const CROPS = [
  'Tomato',
  'Rice',
  'Wheat',
  'Cotton',
  'Maize',
  'Potato',
  'Groundnut',
  'Soybean',
  'Sugarcane',
  'Other',
];

const SOILS = [
  'Red Soil',
  'Black Soil',
  'Sandy Soil',
  'Clay Soil',
  'Loamy Soil',
  'Alluvial Soil',
  'Unknown',
];

const STAGES = [
  'Flowering',
  'Seedling',
  'Vegetative',
  'Fruiting',
  'Harvest',
  'Unknown',
];

const IRRIGATIONS = [
  'Drip',
  'Flood/Furrow',
  'Sprinkler',
  'Rainfed',
  'Other',
  'Unknown',
];

export const NewAdvisoryPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    crop: 'Tomato',
    customCrop: '',
    location: 'Telangana',
    soilType: 'Red Soil',
    growthStage: 'Flowering',
    symptoms: '',
    irrigation: 'Drip',
    weather: '',
    additionalInformation: '',
  });

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognizerRef = useRef(null);
  const initialSymptomsRef = useRef('');

  // Form Voice-over (Read Aloud) state
  const [isReadingForm, setIsReadingForm] = useState(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoWarning, setPhotoWarning] = useState('');
  const fileInputRef = useRef(null);

  // Live Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' or 'user'
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Connect live stream to video element when camera opens
  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch((e) => console.warn('Camera video play error:', e));
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      // Clean up speech recognition
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {
          // ignore
        }
      }
      // Clean up live camera stream
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((track) => track.stop());
        } catch {
          // ignore
        }
      }
      // Stop any speech synthesis
      stopSpeaking();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreFillExample = () => {
    setFormData({
      crop: 'Tomato',
      customCrop: '',
      location: 'Telangana',
      soilType: 'Red Soil',
      growthStage: 'Flowering',
      symptoms:
        language === 'te'
          ? 'కింది ఆకులపై పసుపు మచ్చలు మరియు నల్లటి మచ్చలు కనిపిస్తున్నాయి. పూత రాలుతోంది.'
          : language === 'hi'
          ? 'निचली पत्तियों पर पीले धब्बे और काले चकत्ते दिख रहे हैं। फूल झड़ रहे हैं।'
          : 'Yellow leaves and spots on lower foliage. Mild blossom drop.',
      irrigation: 'Drip',
      weather:
        language === 'te'
          ? 'వేడిగా మరియు పొడిగా ఉంది, 34°C'
          : language === 'hi'
          ? 'गर्म और शुष्क, 34°C'
          : 'Hot and dry, 34°C',
      additionalInformation:
        language === 'te'
          ? 'గత 2 రోజులుగా సమస్య వేగంగా పెరుగుతోంది.'
          : language === 'hi'
          ? 'पिछले 2 दिनों से पीलापन तेजी से बढ़ रहा है।'
          : 'Observed yellowing spreading upward over the last 48 hours.',
    });
    setError('');
  };

  // Toggle Voice-over (Read Instructions Aloud)
  const toggleFormReadAloud = () => {
    if (!isSpeechSynthesisSupported()) {
      setError(t('common.voiceUnavailable', 'Voice playback is unavailable on this device.'));
      return;
    }

    if (isReadingForm) {
      stopSpeaking();
      setIsReadingForm(false);
      return;
    }

    const script =
      language === 'te'
        ? `కొత్త పంట సలహా ప్రారంభించండి. మీ పంట: ${formData.crop}. ప్రాంతం: ${formData.location}. పంట ఫోటోను కెమెరాతో తీయండి లేదా మాట్లాడండి.`
        : language === 'hi'
        ? `नई फसल सलाह शुरू करें। आपकी फसल: ${formData.crop}। स्थान: ${formData.location}। फसल की फोटो लें या बोलकर बताएं।`
        : `Start new crop advisory for ${formData.crop} in ${formData.location}. Take a crop photo or speak to describe symptoms.`;

    speak(script, language, {
      onStart: () => setIsReadingForm(true),
      onEnd: () => setIsReadingForm(false),
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsReadingForm(false);
      },
    });
  };

  // Toggle Voice Input (Microphone Dictation)
  const toggleListening = () => {
    setError('');

    if (!isSpeechRecognitionSupported()) {
      setError(t('common.speechNotSupported', 'Voice input is not supported in this browser.'));
      return;
    }

    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setVoiceStatus('');
      return;
    }

    initialSymptomsRef.current = formData.symptoms ? formData.symptoms.trim() : '';

    try {
      const recognizer = createSpeechRecognizer(language, {
        onResult: ({ fullTranscript, combined }) => {
          const spoken = fullTranscript || combined || '';
          if (spoken) {
            setVoiceStatus(spoken);
            setFormData((prev) => ({
              ...prev,
              symptoms: initialSymptomsRef.current
                ? `${initialSymptomsRef.current} ${spoken}`
                : spoken,
            }));
          }
        },
        onError: (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          setVoiceStatus('');
          if (err === 'not-allowed' || err === 'permission-denied') {
            setError(
              t(
                'newAdvisory.speechPermissionError',
                'Microphone access denied. Please allow microphone in browser settings.'
              )
            );
          }
        },
        onEnd: () => {
          setIsListening(false);
          setVoiceStatus('');
        },
      });

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
        setVoiceStatus(
          language === 'te'
            ? 'వింటోంది... మాట్లాడండి...'
            : language === 'hi'
            ? 'सुन रहा है... बोलिए...'
            : 'Listening... Speak now...'
        );
      }
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
      setVoiceStatus('');
      setError(t('common.speechNotSupported', 'Voice input is not supported in this browser.'));
    }
  };

  // Open Real Camera Feed (Supports mobile rear/front & MacBook/laptop webcams)
  const openCamera = async (facing = 'environment') => {
    setError('');
    setPhotoWarning('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        t(
          'newAdvisory.cameraError',
          'Camera is not supported on this device or browser. Please upload a crop photo.'
        )
      );
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (constraintErr) {
        console.warn('Requested facing mode unavailable, trying generic video camera:', constraintErr);
        // Fallback to default camera - crucial for MacBooks and laptop webcams!
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraOpen(true);
      setCameraFacing(facing);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setError(
        t(
          'newAdvisory.cameraError',
          'Unable to access camera. Please check camera permissions in your browser or upload a photo.'
        )
      );
    }
  };

  // Close Camera
  const closeCamera = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Snap Photo from Video Stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      setPhotoPreview(dataUrl);
      setPhotoName(`crop-camera-${Date.now()}.jpg`);
      setPhotoWarning('');
      closeCamera();
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Could not capture frame from camera.');
    }
  };

  // Flip Camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    openCamera(nextFacing);
  };

  // Handle Photo Selection via File Input
  const handlePhotoChange = (e) => {
    setPhotoWarning('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 1024) {
      setPhotoWarning(
        t(
          'newAdvisory.photoNotClear',
          'Photo is not clear. Please take a clearer, well-lit photo of the affected plant.'
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoName('');
    setPhotoWarning('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCrop =
      formData.crop === 'Other' ? formData.customCrop.trim() : formData.crop;

    if (!finalCrop) {
      setError(t('newAdvisory.specifyCrop', 'Please specify a crop name.'));
      return;
    }

    if (!formData.location.trim()) {
      setError(t('newAdvisory.specifyLocation', 'Please provide your location or district.'));
      return;
    }

    // SYMPTOMS IS OPTIONAL - No minimum length error block!
    const finalSymptoms =
      formData.symptoms.trim() ||
      (photoPreview
        ? language === 'te'
          ? 'పంట ఫోటో ఆధారంగా స్వయంప్రతిపత్తి విశ్లేషణ కోరబడింది.'
          : language === 'hi'
          ? 'फसल फोटो के आधार पर स्वचालित विश्लेषण का अनुरोध।'
          : 'Crop photograph attached for visual diagnostic analysis.'
        : language === 'te'
        ? 'సాధారణ పంట ఆరోగ్యం మరియు కాలానుగుణ సూచనలు.'
        : language === 'hi'
        ? 'सामान्य फसल स्वास्थ्य और मौसमी सलाह।'
        : 'General crop wellness check and seasonal advisory.');

    setIsProcessing(true);
    setActiveStep(0);

    // Stop speaking if reading form
    stopSpeaking();
    setIsReadingForm(false);

    // Sequential multi-agent step simulation
    const timer1 = setTimeout(() => setActiveStep(1), 1100);
    const timer2 = setTimeout(() => setActiveStep(2), 2200);
    const timer3 = setTimeout(() => setActiveStep(3), 3300);

    try {
      const payload = {
        crop: finalCrop,
        location: formData.location.trim(),
        soilType: formData.soilType,
        growthStage: formData.growthStage,
        symptoms: finalSymptoms,
        irrigation: formData.irrigation,
        weather: formData.weather.trim(),
        additionalInformation: formData.additionalInformation.trim(),
        language,
      };

      const res = await advisoryApi.createAdvisory(payload);

      // Complete all steps
      setActiveStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#06b6d4', '#a3e635'],
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/advisory/${res.data.advisory._id}`);
      }, 1000);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          t(
            'common.errorGeneric',
            "Sorry, we couldn't analyze the crop right now. Please try again."
          )
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cinematic AI Processing Experience Modal */}
      <AIProcessingModal isOpen={isProcessing} activeStep={activeStep} />

      {/* ====================================================
          LIVE CAMERA VIEWFINDER MODAL
      ==================================================== */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg-950/90 backdrop-blur-2xl">
          <div className="w-full max-w-lg hologram-card rounded-3xl p-5 sm:p-6 border border-emerald-400/40 shadow-glow-emerald relative overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400">
                <Camera className="w-5 h-5 text-lime-400 animate-pulse" />
                <span className="font-bold text-sm font-display text-white">
                  {t('newAdvisory.cameraLive', 'Live Crop Viewfinder')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  title={t('newAdvisory.switchCamera', 'Switch Camera')}
                  className="p-2 rounded-xl bg-darkBg-900 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-950 transition-all text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="p-2 rounded-xl bg-darkBg-900 border border-slate-700 text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Viewport with Bounding Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-emerald-500/30 shadow-inner">
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch((e) => console.warn('Video element play warning:', e));
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-4 pointer-events-none border border-emerald-400/40 rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-emerald-400/60 rounded-full animate-ping opacity-30" />
                <span className="absolute bottom-2 text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  Point at affected leaf or plant
                </span>
              </div>
            </div>

            {/* Shutter Action Bar */}
            <div className="mt-4 pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2.5 rounded-xl bg-darkBg-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-black font-extrabold text-sm shadow-glow-green transition-all hover:scale-105"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>{t('newAdvisory.snapPhoto', 'Snap Photo')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('newAdvisory.multiAgentActive', 'Multi-Agent Diagnostic Intake')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t('newAdvisory.title', 'Start New Crop Advisory')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('newAdvisory.subtitle', 'Provide crop observations for autonomous multi-agent analysis')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Read Aloud Voice Over Button */}
          {isSpeechSynthesisSupported() && (
            <button
              type="button"
              onClick={toggleFormReadAloud}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-glass ${
                isReadingForm
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-darkBg-900 hover:bg-emerald-950 text-cyan-300 border-cyan-500/30'
              }`}
              title={isReadingForm ? t('common.stop', 'Stop') : t('newAdvisory.readForm', 'Listen to Form Instructions')}
            >
              {isReadingForm ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
                  <span>{t('common.stop', 'Stop')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('common.voiceOver', 'Voice Over')}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handlePreFillExample}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-darkBg-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 transition-all shadow-glass"
          >
            {t('newAdvisory.prefillBtn', '⚡ Fill Example Farm Data')}
          </button>
        </div>
      </div>

      {/* Futuristic Form Card */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-glow-emerald">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Farmer Photo Intake Section */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-darkBg-950/70 border border-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {t('newAdvisory.photoPrompt', 'Upload Crop Photo')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t(
                  'newAdvisory.photoHint',
                  "Don't know what's wrong with your crop? Just show us a photo, speak in your language, and AgroMind AI will help."
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* File Input for Uploading Photo */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="crop-photo-file"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-darkBg-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t('newAdvisory.photoPrompt', 'Upload Crop Photo')}</span>
              </button>

              {/* Take Photo: Opens live Camera Viewfinder directly! */}
              <button
                type="button"
                onClick={() => openCamera('environment')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-all shadow-glow-green"
              >
                <Camera className="w-3.5 h-3.5 text-lime-400" />
                <span>{t('newAdvisory.photoTake', 'Take Photo')}</span>
              </button>
            </div>
          </div>

          {photoWarning && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{photoWarning}</span>
            </div>
          )}

          {photoPreview && (
            <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-darkBg-900/90 border border-emerald-500/30">
              <img
                src={photoPreview}
                alt="Selected Crop"
                className="w-14 h-14 object-cover rounded-lg border border-emerald-500/40"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {photoName || t('newAdvisory.photoSelected', 'Photo attached')}
                </p>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('newAdvisory.photoSelected', 'Photo attached')}
                </span>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="p-1 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Crop + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.cropLabel', 'Crop')} <span className="text-emerald-400">*</span>
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c} className="bg-darkBg-900 text-white">
                    {t(`crops.${c}`, c)}
                  </option>
                ))}
              </select>

              {formData.crop === 'Other' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="customCrop"
                    placeholder={t('newAdvisory.customCropPlaceholder', 'Enter crop name...')}
                    value={formData.customCrop}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-2.5 rounded-2xl border border-emerald-500/20 bg-darkBg-950 text-white text-sm outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.locationLabel', 'Location / District')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder={t('newAdvisory.locationPlaceholder', 'e.g. Telangana')}
                value={formData.location}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Soil Type, Growth Stage, Irrigation Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.soilLabel', 'Soil Type')} <span className="text-emerald-400">*</span>
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {SOILS.map((s) => (
                  <option key={s} value={s} className="bg-darkBg-900 text-white">
                    {t(`soils.${s}`, s)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.stageLabel', 'Growth Stage')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <select
                name="growthStage"
                value={formData.growthStage}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {STAGES.map((st) => (
                  <option key={st} value={st} className="bg-darkBg-900 text-white">
                    {t(`stages.${st}`, st)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.irrigationLabel', 'Irrigation Method')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <select
                name="irrigation"
                value={formData.irrigation}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {IRRIGATIONS.map((irr) => (
                  <option key={irr} value={irr} className="bg-darkBg-900 text-white">
                    {t(`irrigation.${irr}`, irr)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Observed Symptoms (OPTIONAL - Asterisk removed) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('newAdvisory.symptomsLabel', 'Symptoms')}{' '}
                <span className="text-slate-500 font-normal">({t('common.optional', 'Optional')})</span>
              </label>

              {/* Voice Input Mic Button */}
              {isSpeechRecognitionSupported() ? (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-glow-rose animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
                  }`}
                  aria-label={isListening ? t('common.stop', 'Stop') : t('common.speak', 'Speak')}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400 animate-ping" />
                      <span>{t('common.stopSpeaking', 'Listening...')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t('common.speak', 'Speak')}</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>

            {voiceStatus && (
              <div className="mb-2 p-2 rounded-xl bg-emerald-950/50 border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{voiceStatus}</span>
              </div>
            )}

            <textarea
              name="symptoms"
              rows={4}
              placeholder={t(
                'newAdvisory.symptomsPlaceholder',
                'Describe color changes, leaf spots, wilting, curling, affected plant portions, or click speak (Optional if photo is attached)...'
              )}
              value={formData.symptoms}
              onChange={handleChange}
              disabled={isProcessing}
              className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-y"
            />
          </div>

          {/* Row 4: Weather & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.weatherLabel', 'Weather Conditions')}{' '}
                <span className="text-slate-500 font-normal">({t('common.optional', 'Optional')})</span>
              </label>
              <input
                type="text"
                name="weather"
                placeholder={t('newAdvisory.weatherPlaceholder', 'e.g. Hot and dry')}
                value={formData.weather}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('newAdvisory.notesLabel', 'Additional Information')}{' '}
                <span className="text-slate-500 font-normal">({t('common.optional', 'Optional')})</span>
              </label>
              <input
                type="text"
                name="additionalInformation"
                placeholder={t('newAdvisory.notesPlaceholder', 'e.g. Yellowing started 3 days ago')}
                value={formData.additionalInformation}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                {t(
                  'newAdvisory.orchestratorPipeline',
                  'Orchestrates: Problem Analyzer → Reasoning → Risk → Action Planner'
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-black font-extrabold text-sm sm:text-base shadow-glow-green transition-all hover:scale-105 disabled:opacity-50"
            >
              <span>{t('newAdvisory.submitBtn', 'Run AI Analysis →')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdvisoryPage;
