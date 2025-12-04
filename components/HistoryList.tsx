import React from 'react';
import { TrophyIcon } from './Icons';
import { Winner } from '../types';

interface HistoryListProps {
  winners: Winner[];
}

const HistoryList: React.FC<HistoryListProps> = ({ winners }) => {
  if (winners.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 mt-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
        Ganadores ({winners.length})
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-3">#</th>
                <th scope="col" className="px-6 py-3">Número</th>
                <th scope="col" className="px-6 py-3">Premio</th>
                <th scope="col" className="px-6 py-3 text-right">Hora</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, idx) => (
                <tr key={winner.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{winners.length - idx}</td>
                  <td className="px-6 py-4 font-bold text-blue-600 text-lg">#{winner.numero}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{winner.premio}</td>
                  <td className="px-6 py-4 text-right text-gray-400 font-mono">
                    {winner.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;