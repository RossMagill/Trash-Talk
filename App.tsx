import React, { useState, useRef } from 'react';
import { AppState, TrashAnalysis, BinType } from './types';
import { analyzeTrashImage, generateRaccoonSpeech } from './services/geminiService';
import { playPcmAudio } from './utils/audioUtils';
import CameraView from './components/CameraView';
import RaccoonAvatar from './components/RaccoonAvatar';
import ResultCard from './components/ResultCard';
import RankingView from './components/RankingView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<TrashAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  const handleCapture = async (imageSrc: string) => {
    // Stop any previous audio
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      const result = await analyzeTrashImage(imageSrc);
      setAnalysis(result);
      setAppState(AppState.RESULT);

      // Trigger TTS after showing result
      if (result.sassyComment) {
        try {
          const audioBase64 = await generateRaccoonSpeech(result.sassyComment);
          if (audioBase64) {
            // Check if we are still in the RESULT state before playing
            // This prevents audio playing if the user has already reset
            const stopFn = await playPcmAudio(audioBase64);
            stopAudioRef.current = stopFn;
          }
        } catch (speechErr) {
          console.error("Speech generation error (non-fatal):", speechErr);
        }
      }

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg("I got distracted. Try again.");
    }
  };

  const handleReset = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    setAppState(AppState.IDLE);
    setAnalysis(null);
    setErrorMsg(null);
  };

  const handleError = (msg: string) => {
    setAppState(AppState.ERROR);
    setErrorMsg(msg);
  };

  // Helper to determine highlighting for footer bins
  const getBinOpacity = (binType: string) => {
    if (appState !== AppState.RESULT || !analysis) return 'opacity-60 bg-white/5';
    if (analysis.bin === binType) return 'opacity-100 bg-white/20 border border-white/30';
    return 'opacity-30 bg-transparent';
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#1a2c20] text-white overflow-hidden flex flex-col font-sans">
      
      {/* Background Gradient Spot */}
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-[#2a4c33] rounded-full blur-[100px] opacity-40 pointer-events-none"></div>

      {/* Background Logo - Stencil Style */}
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10 pointer-events-none select-none overflow-hidden pb-32">
        <div className="flex flex-col items-center transform -rotate-6 scale-125 md:scale-110">
          <div className="bg-black text-white text-[15vh] leading-[0.85] font-stencil px-6 py-2 mb-2 tracking-tighter shadow-xl border-4 border-white/10">
            TRASH
          </div>
          <div className="bg-black text-white text-[15vh] leading-[0.85] font-stencil px-6 py-2 tracking-tighter shadow-xl border-4 border-white/10">
            TALK
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-end">
        <button 
          onClick={() => setAppState(AppState.RANKING)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#bef264] text-[#1a2c20] shadow-lg active:scale-95 transition-transform"
        >
          <div className="flex items-end gap-[2px] h-5 mb-1">
            <div className="w-1.5 h-2 bg-[#1a2c20] rounded-sm"></div>
            <div className="w-1.5 h-3 bg-[#1a2c20] rounded-sm"></div>
            <div className="w-1.5 h-5 bg-[#1a2c20] rounded-sm"></div>
          </div>
          <span className="text-[10px] font-bold leading-none">Ranking</span>
        </button>
      </div>

      {/* Main Raccoon Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center z-10 -mt-20">
        <RaccoonAvatar state={appState} binType={analysis?.bin} />
      </div>

      {/* Overlay UI Cards */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-24 flex flex-col justify-end min-h-[50%] bg-gradient-to-t from-[#1a2c20] via-[#1a2c20]/90 to-transparent">
        
        {/* IDLE STATE CARD */}
        {appState === AppState.IDLE && (
          <div className="glass-panel rounded-[2rem] p-6 animate-fade-in-up">
            <div className="flex justify-center -mt-16 mb-4">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                 <span className="text-4xl">📸</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1 text-center">Hi there, I'm Rumi...</h2>
            <p className="text-white/70 text-center mb-6">Please show me your trash so I can judge you.</p>
            <button 
              onClick={() => setAppState(AppState.CAMERA)}
              className="w-full py-4 bg-[#bef264] text-[#1a2c20] font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] active:scale-95 transition-all"
            >
              Scan Trash
            </button>
          </div>
        )}

        {/* ANALYZING STATE CARD */}
        {appState === AppState.ANALYZING && (
          <div className="glass-panel rounded-[2rem] p-8 text-center animate-pulse">
            <div className="w-12 h-12 border-4 border-[#bef264] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold">Sniffing...</h3>
            <p className="text-white/60">Is that edible?</p>
          </div>
        )}

        {/* RESULT STATE CARD */}
        {appState === AppState.RESULT && analysis && (
          <ResultCard analysis={analysis} onReset={handleReset} />
        )}

        {/* ERROR STATE CARD */}
        {appState === AppState.ERROR && (
          <div className="glass-panel rounded-[2rem] p-6 text-center border-red-500/30 bg-red-900/10">
            <h2 className="text-xl font-bold text-red-400 mb-2">My Bad</h2>
            <p className="text-white/80 mb-6">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer Bins - Bottom Navigation/Status */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-between gap-3">
        <div className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${getBinOpacity(BinType.RECYCLING)}`}>
          <span className="text-sm md:text-base">♻️</span>
          <span className="text-xs font-bold uppercase hidden sm:inline">Recycle</span>
        </div>
        <div className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${getBinOpacity(BinType.GARBAGE)}`}>
          <span className="text-sm md:text-base">🗑️</span>
          <span className="text-xs font-bold uppercase hidden sm:inline">Landfill</span>
        </div>
        <div className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${getBinOpacity(BinType.COMPOST)}`}>
          <span className="text-sm md:text-base">🍎</span>
          <span className="text-xs font-bold uppercase hidden sm:inline">Organic</span>
        </div>
      </div>

      {/* Camera Overlay */}
      {appState === AppState.CAMERA && (
        <CameraView 
          onCapture={handleCapture} 
          onClose={() => setAppState(AppState.IDLE)}
          onError={handleError}
        />
      )}

      {/* Ranking Overlay */}
      {appState === AppState.RANKING && (
        <RankingView onClose={() => setAppState(AppState.IDLE)} />
      )}

    </div>
  );
};

export default App;