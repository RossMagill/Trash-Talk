import React from 'react';

interface RankingViewProps {
  onClose: () => void;
}

const RankingView: React.FC<RankingViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#355e42] text-white flex flex-col overflow-y-auto font-sans">
      {/* Header / Close Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-8 pt-12 max-w-lg mx-auto w-full">
        <h1 className="text-6xl font-black leading-[0.9] tracking-tighter mb-10 text-[#e9e4d9]">
          Current<br />
          University<br />
          Ranking
        </h1>

        {/* First Place Card */}
        <div className="bg-[#bef264] rounded-[2.5rem] p-8 pb-12 mb-8 text-[#1a2c20] relative flex flex-col items-center text-center shadow-xl">
          {/* Decorative Stars */}
          <div className="absolute top-12 left-12 text-[#8bb542] transform -rotate-12">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="absolute top-20 right-16 text-[#8bb542] transform rotate-12 scale-75">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          {/* Number 1 Badge */}
          <div className="w-24 h-24 bg-[#1a2c20] rounded-[2rem] flex items-center justify-center text-6xl font-black text-white mb-6 shadow-lg z-10">
            1
          </div>

          <h2 className="text-3xl font-black leading-tight mb-2">Simon Fraser University</h2>
          <div className="text-lg font-bold opacity-80">
            Points: <span className="font-black">10,125,738</span>
          </div>
          <div className="text-lg font-bold opacity-80">
            Participants: <span className="font-black">1,120</span>
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-6">
          {/* Rank 2 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#1a2c20] rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">University of British Columbia</h3>
              <div className="text-sm opacity-80 font-medium">
                Points: 10,125,738 <br/> Participants: 1,120
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#1a2c20] rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">Emily Carr University of Art+Design</h3>
              <div className="text-sm opacity-80 font-medium">
                Points: 10,125,738 <br/> Participants: 1,120
              </div>
            </div>
          </div>

          {/* Rank 4 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#1a2c20] rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">British Columbia Institute of Technology</h3>
              <div className="text-sm opacity-80 font-medium">
                Points: 10,125,738 <br/> Participants: 1,120
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingView;