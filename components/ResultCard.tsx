import React from 'react';
import { TrashAnalysis, BinType } from '../types';

interface ResultCardProps {
  analysis: TrashAnalysis;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ analysis, onReset }) => {
  const getBinColorText = (bin: BinType) => {
    switch (bin) {
      case BinType.RECYCLING: return 'text-blue-400';
      case BinType.COMPOST: return 'text-green-400';
      case BinType.GARBAGE: return 'text-gray-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="w-full glass-panel rounded-[2rem] p-6 animate-fade-in-up">
      <div className="text-center mb-4">
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-2 text-white/70">
          Verdict
        </div>
        <h2 className={`text-3xl font-black uppercase tracking-wide ${getBinColorText(analysis.bin)}`}>
          {analysis.bin}
        </h2>
        <p className="text-white/60 text-sm font-medium mt-1 uppercase tracking-widest">
          {analysis.item}
        </p>
      </div>

      <div className="bg-black/20 rounded-xl p-4 mb-6 relative border border-white/5">
        <p className="text-lg text-gray-200 italic font-medium leading-relaxed text-center">
          "{analysis.sassyComment}"
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-[#bef264] text-[#1a2c20] font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        Scan Next Item
      </button>
    </div>
  );
};

export default ResultCard;