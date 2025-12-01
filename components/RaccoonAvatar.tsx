import React from 'react';
import { AppState, BinType } from '../types';

interface RaccoonAvatarProps {
  state: AppState;
  binType?: BinType;
}

const RaccoonAvatar: React.FC<RaccoonAvatarProps> = ({ state, binType }) => {
  // Placeholder URL for the raccoon PNG.
  // Replace this with your own hosted image URL or local asset import.
  const raccoonImageSrc = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Raccoon.png";

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full pointer-events-none">
      <div className={`
        relative w-72 h-72 md:w-96 md:h-96 transition-all duration-500 transform
        ${state === AppState.ANALYZING ? 'animate-bounce scale-105' : 'scale-100'}
        ${state === AppState.RESULT ? 'scale-105' : ''}
      `}>
        <img 
          src={raccoonImageSrc} 
          alt="Rumi the Raccoon" 
          className="w-full h-full object-contain filter drop-shadow-2xl"
        />

        {/* Status Overlay - Thinking */}
        {state === AppState.ANALYZING && (
           <div className="absolute -top-2 right-0 bg-white text-4xl p-3 rounded-full shadow-lg animate-bounce delay-100">
             🤔
           </div>
        )}

        {/* Status Overlay - Result */}
        {state === AppState.RESULT && binType && (
           <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-fade-in-up border-4 border-[#bef264] z-10 rotate-12">
             <span className="text-5xl">
               {binType === BinType.RECYCLING && '♻️'}
               {binType === BinType.COMPOST && '🍎'}
               {binType === BinType.GARBAGE && '🗑️'}
               {binType === BinType.UNKNOWN && '🤷'}
             </span>
           </div>
        )}
      </div>
      
      {/* Shadow Effect */}
      <div className="w-56 h-8 bg-black/30 rounded-[100%] blur-xl mt-8"></div>
    </div>
  );
};

export default RaccoonAvatar;