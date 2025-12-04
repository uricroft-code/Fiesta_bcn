import React from 'react';
import { RotateCwIcon } from './Icons';

interface RaffleCardProps {
  title: string;
  icon: React.ReactNode;
  remainingCount: number;
  currentValue: string | number | null;
  isSpinning: boolean;
  onSpin: () => void;
  disabled: boolean;
  themeColor: 'pink' | 'blue';
  spinButtonText: string;
}

const RaffleCard: React.FC<RaffleCardProps> = ({
  title,
  icon,
  remainingCount,
  currentValue,
  isSpinning,
  onSpin,
  disabled,
  themeColor,
  spinButtonText,
}) => {
  const isPink = themeColor === 'pink';

  const borderColor = isPink ? 'border-pink-300' : 'border-blue-300';
  const gradientStart = isPink ? 'from-pink-100' : 'from-blue-100';
  const gradientEnd = isPink ? 'to-purple-100' : 'to-indigo-100';
  const badgeColor = isPink ? 'bg-pink-500' : 'bg-blue-500';
  const btnColor = isPink ? 'bg-pink-500 hover:bg-pink-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col h-full transform transition-all hover:shadow-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <span className={`${badgeColor} text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm`}>
          {remainingCount} restantes
        </span>
      </div>

      <div className={`bg-gradient-to-br ${gradientStart} ${gradientEnd} rounded-lg p-4 mb-6 flex-grow flex items-center justify-center border-4 ${borderColor} min-h-[200px] shadow-inner`}>
        <p className={`font-bold text-center text-gray-800 break-words w-full ${typeof currentValue === 'number' ? 'text-7xl' : 'text-3xl'}`}>
          {currentValue !== null ? currentValue : (typeof currentValue === 'number' ? '?' : '🎁')}
        </p>
      </div>

      <button
        onClick={onSpin}
        disabled={disabled}
        className={`w-full ${btnColor} disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 text-xl transition-all shadow-md active:scale-95`}
      >
        <RotateCwIcon className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? 'Girando...' : spinButtonText}
      </button>
    </div>
  );
};

export default RaffleCard;