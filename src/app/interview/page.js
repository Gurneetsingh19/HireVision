"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, AlertTriangle, Eye, Server, Maximize, MessageSquare, Sparkles, Volume2, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

export default function InterviewRoom() {
  const [status, _setStatus] = useState('idle'); // 'idle' | 'speaking' | 'listening' | 'processing'
  const [voiceModeStarted, _setVoiceModeStarted] = useState(false);
  const [messages, _setMessages] = useState([]);
  const [timer, setTimer] = useState(1800); // 30 mins
  const [alert, setAlert] = useState(null);

  // References for keeping state inside asynchronous callbacks/listeners to avoid stale closures
  const statusRef = useRef('idle');
  const voiceModeStartedRef = useRef(false);
  const messagesRef = useRef([]);
  const firstQuestionAsked = useRef(false);
  const isGeneratingRef = useRef(false);
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);
  const API_URL = process.env.NEW_PUBLIC_API;
  // Sync state functions with their references
  const setStatus = (val) => {
    statusRef.current = val;
    _setStatus(val);
  };

  const setVoiceModeStarted = (val) => {
    voiceModeStartedRef.current = val;
    _setVoiceModeStarted(val);
  };

  const setMessages = (val) => {
    const updated = typeof val === 'function' ? val(messagesRef.current) : val;
    messagesRef.current = updated;
    _setMessages(updated);
  };

  // WebRTC Setup (Camera is always ON, audio is active)
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    setupCamera();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (e) {}
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Sync camera track to always stay ON, audio track synced with microphone
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = true);
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = true);
    }
  }, [status]);

  // Face detection loop (runs every 3 seconds)
  const checkFace = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const response = await fetch(`${API_URL}/interview`, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          console.log("Face detected:", data.face_detected);

          if (!data.face_detected) {
            setAlert("Face not detected");
          } else {
            setAlert(null);
          }
        } catch (e) {
          console.error("Error matching face detector:", e);
        }
      }, "image/jpeg");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const faceInterval = setInterval(() => {
      checkFace();
    }, 3000);

    return () => clearInterval(faceInterval);
  }, []);

  // Initial prompt setup on mount
  useEffect(() => {
    if (firstQuestionAsked.current) return;
    firstQuestionAsked.current = true;

    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const data = localStorage.getItem("resumeData");
    const resume = JSON.parse(data);

    setStatus('processing');
    fetch("/api/interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: resume,
        history: [],
      }),
    })
    .then((res) => {
      if (!res.ok) throw new Error("API Connection Failed");
      return res.json();
    })
    .then((data) => {
      setMessages([
        { role: "assistant", content: data.question }
      ]);
      console.log("Initial Question:", data.question);
      playVoice(data.question);
    })
    .catch((err) => {
      console.error("Error initializing session:", err);
      setStatus('idle');
    });

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  // ElevenLabs / Speak feature playVoice function
  const playVoice = async (text) => {
    setStatus('speaking');
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Speak API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (e) {}
      }
      currentAudioRef.current = audio;

      audio.onended = () => {
        currentAudioRef.current = null;
        if (voiceModeStartedRef.current) {
          triggerSpeechRecognition();
        } else {
          setStatus('idle');
        }
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        currentAudioRef.current = null;
        if (voiceModeStartedRef.current) {
          triggerSpeechRecognition();
        } else {
          setStatus('idle');
        }
      };

      await audio.play();
    } catch (err) {
      console.error("Error playing voice synthesis:", err);
      // Fallback: automatically trigger recognition if voiceMode is active
      if (voiceModeStartedRef.current) {
        triggerSpeechRecognition();
      } else {
        setStatus('idle');
      }
    }
  };

  // Speech Recognition Flow
  const triggerSpeechRecognition = () => {
    if (!voiceModeStartedRef.current) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    setStatus('listening');
    console.log("Listening for candidate answer...");

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (!result.isFinal) return;

      const text = result[0].transcript;
      console.log("Candidate transcript:", text);
      handleCandidateAnswer(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'no-speech') {
        console.log("No speech detected. Restarting listening loop...");
        setTimeout(() => {
          if (voiceModeStartedRef.current && statusRef.current === 'listening') {
            triggerSpeechRecognition();
          }
        }, 1200);
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => {
      // Loop ends or triggers next step
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
    }
  };

  // Handle Candidate Response
  const handleCandidateAnswer = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);

    await sendToGemini(updatedMessages);
  };

  // Fetch from /interview
  const sendToGemini = async (updatedMessages) => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setStatus('processing');

    const resumeData = JSON.parse(localStorage.getItem("resumeData"));

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resumeData,
          history: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Interview API response failed");
      }

      const data = await response.json();

      setMessages((oldMessages) => [
        ...oldMessages,
        {
          role: "assistant",
          content: data.question,
        },
      ]);

      await playVoice(data.question);
    } catch (err) {
      console.error("Error retrieving question:", err);
      setStatus('idle');
    } finally {
      isGeneratingRef.current = false;
    }
  };

  // Voice Mode Button Toggle
  const handleMicClick = () => {
    if (voiceModeStarted) {
      setVoiceModeStarted(false);
      setStatus('idle');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (e) {}
      }
    } else {
      setVoiceModeStarted(true);
      if (status === 'speaking') {
        // If AI is currently speaking, wait for it to finish.
        // The playVoice's onended event will automatically trigger the recognition loop.
      } else {
        triggerSpeechRecognition();
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Selector for the current active question
  const currentQuestion = [...messages].reverse().find(msg => msg.role === 'assistant')?.content || "Initializing interview room connection...";

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 font-sans text-gray-200 selection:bg-primary/30">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)] flex flex-col gap-4">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 glass-card-dark rounded-2xl border-white/10 shrink-0 shadow-lg shadow-black/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse neon-glow"></div>
              <span className="font-bold tracking-wider uppercase text-sm">Live Voice Session</span>
            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-gray-400 font-mono text-sm">ID: HV-902-8X</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Server size={16} className="text-green-500 animate-pulse" />
              <span className="text-green-500 font-mono">42ms Latency</span>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 font-mono font-bold text-lg text-primary shadow-inner">
              {formatTime(timer)}
            </div>
          </div>
        </header>

        {/* Main Split View */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          
          {/* LEFT: AI Interviewer Card (60% width on large screens) */}
          <GlassCard dark className="lg:flex-[3] flex flex-col relative overflow-hidden border-white/10 !p-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5 relative z-10 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(79,140,255,0.3)]">
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-wide">AI Panel</h3>
                <p className="text-xs text-gray-400">HireVision AI Interviewer Core</p>
              </div>
              
              {/* Dynamic Soundwave animation (only active when AI is speaking) */}
              <div className="ml-auto flex items-center gap-1 h-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className={`w-1 rounded-full bg-primary transition-all duration-300 ${
                      status === 'speaking' ? 'animate-bounce' : 'h-1.5 opacity-40'
                    }`} 
                    style={{ 
                      height: status === 'speaking' ? `${30 + Math.random() * 70}%` : '6px', 
                      animationDelay: `${i * 0.1}s`, 
                      animationDuration: '0.4s' 
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* AI Avatar Core Visualization Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 min-h-0 select-none">
              
              <div className="relative w-48 h-48 rounded-full flex items-center justify-center bg-black/40 border border-white/5 shadow-[0_0_40px_rgba(79,140,255,0.08)]">
                {/* Outer spinning gradient glow */}
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-purple-500 opacity-20 blur-md ${
                    status === 'speaking' ? 'animate-spin' : 
                    status === 'processing' ? 'animate-spin' : 
                    'animate-pulse'
                  }`}
                  style={{ animationDuration: status === 'processing' ? '2.5s' : status === 'speaking' ? '7s' : '4s' }}
                ></div>
                
                {/* Visualizer Sphere */}
                <div className="relative z-10 w-40 h-40 rounded-full bg-[#0D0E12] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                  {/* Glowing core indicator */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    status === 'speaking' ? 'bg-primary/20 border border-primary shadow-[0_0_25px_rgba(79,140,255,0.5)] scale-110' :
                    status === 'listening' ? 'bg-emerald-500/20 border border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.5)] scale-125 animate-pulse' :
                    status === 'processing' ? 'bg-amber-500/20 border border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] animate-bounce scale-105' :
                    'bg-white/5 border border-white/10 scale-100'
                  }`}>
                    {status === 'speaking' && <Volume2 className="text-primary w-8 h-8" />}
                    {status === 'listening' && <Mic className="text-emerald-400 w-8 h-8" />}
                    {status === 'processing' && <RefreshCw className="text-amber-400 w-8 h-8 animate-spin" />}
                    {status === 'idle' && <Sparkles className="text-gray-400 w-8 h-8" />}
                  </div>
                  
                  {/* Subtle Waveforms Inside Core (only active during speaking) */}
                  {status === 'speaking' && (
                    <div className="absolute bottom-6 flex items-end gap-1 h-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-primary/70 rounded-full animate-pulse" 
                          style={{ 
                            height: `${30 + Math.random() * 70}%`, 
                            animationDelay: `${i * 0.15}s`, 
                            animationDuration: '0.5s' 
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Pulsing Concentric Radar Rings (only active during listening) */}
                  {status === 'listening' && (
                    <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping pointer-events-none"></div>
                  )}
                </div>
              </div>

              {/* Glowing Dynamic Status Badge */}
              <div className="flex justify-center mt-6">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase border shadow-sm transition-all duration-300 ${
                  status === 'speaking' ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(79,140,255,0.15)] animate-pulse' :
                  status === 'listening' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]' :
                  status === 'processing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]' :
                  'bg-white/5 border-white/10 text-gray-400'
                }`}>
                  {status === 'speaking' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                      <span>AI Speaking...</span>
                    </>
                  )}
                  {status === 'listening' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Listening...</span>
                    </>
                  )}
                  {status === 'processing' && (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Answer...</span>
                    </>
                  )}
                  {status === 'idle' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      <span>Voice Mode Offline</span>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Current Question Container Panel (Clean and legible, no scrollable list of bubbles) */}
            <div className="p-6 border-t border-white/10 bg-black/40 relative z-10 shrink-0">
              <div className="bg-[#12131A]/90 border border-white/10 rounded-2xl p-5 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="text-[10px] tracking-widest text-primary/80 font-bold uppercase mb-2 font-mono flex items-center gap-1.5">
                  <MessageSquare size={10} />
                  <span>Current Interviewer Prompt</span>
                </div>
                <p className="text-base text-gray-200 leading-relaxed font-light">
                  {currentQuestion}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* RIGHT: Candidate Video Feed (40% width on large screens) */}
          <GlassCard dark className="lg:flex-[2] relative overflow-hidden border-white/10 flex flex-col !p-0 shadow-2xl">
            {/* Warning Alert Overlay */}
            {alert && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-[90%]">
                <div className="bg-red-500/90 text-white px-4 py-2.5 rounded-xl border border-red-400 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 backdrop-blur-md">
                  <AlertTriangle size={18} className="animate-bounce" />
                  <span className="text-xs font-bold tracking-wide">{alert}</span>
                </div>
              </div>
            )}

            {/* WebRTC Video Feed (Always ON, video controls removed) */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
              />
              
              {/* Futuristic corners monitoring HUD */}
              <div className="absolute inset-0 border-4 border-transparent border-t-primary/30 border-l-primary/30 m-4 rounded-xl pointer-events-none transition-all duration-500"></div>
              <div className="absolute inset-0 border-4 border-transparent border-b-primary/30 border-r-primary/30 m-4 rounded-xl pointer-events-none transition-all duration-500"></div>
              
              {/* Flashing "LIVE MONITORING" feed indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-gray-300 uppercase">Live Cam Feed</span>
              </div>

              {/* Eye tracking frame */}
              <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-40 h-20 border border-accent/20 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-ping"></div>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <Eye size={12} className="text-accent animate-pulse" />
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Active Face Tracking</span>
              </div>
            </div>

            {/* Controls panel: Standard voice trigger & end interview */}
            <div className="p-5 bg-white/5 border-t border-white/10 flex flex-col items-center gap-3 shrink-0 z-10">
              <div className="flex items-center justify-center gap-4 w-full">
                
                {/* Voice Mode mic button trigger */}
                <button 
                  onClick={handleMicClick}
                  className={`px-6 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2.5 font-bold shadow-lg text-sm cursor-pointer ${
                    voiceModeStarted 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 border border-emerald-400/50' 
                      : 'bg-primary hover:bg-primary/95 text-white shadow-primary/20 border border-primary/50'
                  }`}
                >
                  {voiceModeStarted ? (
                    <>
                      <Mic className="w-4.5 h-4.5 animate-pulse" />
                      <span>Voice Mode Active</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4.5 h-4.5" />
                      <span>Start Voice Mode</span>
                    </>
                  )}
                </button>
                
                {/* End Session Button */}
                <Link href="/dashboard">
                  <button className="px-6 py-3.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-all font-bold flex items-center gap-2 border border-red-400/40 text-sm shadow-lg shadow-red-500/10 cursor-pointer">
                    <PhoneOff size={18} />
                    <span>End Interview</span>
                  </button>
                </Link>
              </div>

              {/* User micro-helper text */}
              <p className="text-[10px] text-gray-500 font-mono text-center max-w-[280px]">
                {voiceModeStarted 
                  ? "AI will speak first. When AI stops, speak clearly to reply. Loops automatically."
                  : "Click 'Start Voice Mode' to begin the automated conversation."}
              </p>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
