
import React from 'react';
import { XIcon, TrophyIcon } from './Icons';
import { INITIAL_PRIZES, INITIAL_NUMBER_COUNT, INITIAL_NUMBER_START } from '../constants';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
             <TrophyIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Cómo Funciona</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
            <p className="flex items-center gap-2">
              ✅ <span className="font-semibold">{INITIAL_PRIZES.length} premios</span> para sortear
            </p>
            <p className="flex items-center gap-2">
              ✅ <span className="font-semibold">{INITIAL_NUMBER_COUNT} números</span> disponibles (del {INITIAL_NUMBER_START} al {INITIAL_NUMBER_START + INITIAL_NUMBER_COUNT - 1})
            </p>
            <p className="flex items-center gap-2">
              ✅ Se sortearán <span className="font-semibold">{INITIAL_PRIZES.length} ganadores</span>
            </p>
            <p className="flex items-center gap-2">
              ⚠️ Quedarán <span className="font-semibold">{INITIAL_NUMBER_COUNT - INITIAL_PRIZES.length} números</span> sin premio
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p>🔴 <strong>Los números nunca se repiten:</strong> se eliminan automáticamente después de salir.</p>
            <p>🎁 <strong>Los premios se eliminan</strong> de la lista después de ser sorteados.</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-gray-900 mb-2">Instrucciones:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-1">
              <li>Pulsa el botón grande <strong>¡SORTEAR!</strong></li>
              <li>La tómbola seleccionará primero un <strong>premio</strong> al azar.</li>
              <li>Automáticamente después, buscará el <strong>número ganador</strong>.</li>
              <li>¡El resultado aparecerá en pantalla!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
