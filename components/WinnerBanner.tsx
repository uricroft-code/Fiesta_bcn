import React from 'react';
import { Winner } from '../types.ts';

interface WinnerBannerProps {
  winner: Winner;
  visible: boolean;
}

const WinnerBanner: React.FC<WinnerBannerProps> = ({ winner, visible }) => {
  if (!visible) return null;

  return (
    <div className="mb-6 bg-yellow-400 border-4 border-yellow-600 rounded-xl p-6 text-center animate-pulse shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 uppercase tracking-wider">
        🎉 ¡Ganador! 🎉
      </h2>
      <div className="space-y-2">
         <p className="text-4xl md:text-5xl font-black text-blue-900">
            #{winner.numero}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-gray-800">
          {winner.premio}
        </p>
      </div>
    </div>
  );
};

export default WinnerBanner;