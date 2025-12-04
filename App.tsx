import React, { useState, useCallback, useRef, useEffect } from 'react';
import { INITIAL_PRIZES, INITIAL_NUMBER_START, INITIAL_NUMBER_COUNT } from './constants';
import { Winner } from './types';
import { GiftIcon, UsersIcon, TrophyIcon, TrashIcon, InfoIcon } from './components/Icons';
import WinnerBanner from './components/WinnerBanner';
import RaffleCard from './components/RaffleCard';
import HistoryList from './components/HistoryList';
import InfoModal from './components/InfoModal';

const App: React.FC = () => {
  // --- State ---
  const [prizes, setPrizes] = useState<string[]>(INITIAL_PRIZES);
  const [numbers, setNumbers] = useState<number[]>([]);
  
  const [currentPrize, setCurrentPrize] = useState<string | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  
  const [isSpinningPrize, setIsSpinningPrize] = useState(false);
  const [isSpinningNumber, setIsSpinningNumber] = useState(false);
  
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize numbers once
  useEffect(() => {
    const initialNumbers = Array.from(
      { length: INITIAL_NUMBER_COUNT },
      (_, i) => i + INITIAL_NUMBER_START
    );
    setNumbers(initialNumbers);
  }, []);

  // --- Handlers ---

  const handleSpinPrize = useCallback(() => {
    if (prizes.length === 0 || isSpinningPrize) return;
    
    setIsSpinningPrize(true);
    setShowWinner(false); // Hide previous winner if any

    let counter = 0;
    const maxIterations = 20;
    const intervalTime = 100;

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      setCurrentPrize(prizes[randomIndex]);
      counter++;

      if (counter > maxIterations) {
        clearInterval(intervalId);
        // Final selection happens here
        const finalIndex = Math.floor(Math.random() * prizes.length);
        const selectedPrize = prizes[finalIndex];
        setCurrentPrize(selectedPrize);
        setIsSpinningPrize(false);
      }
    }, intervalTime);
  }, [prizes, isSpinningPrize]);

  const handleSpinNumber = useCallback(() => {
    if (numbers.length === 0 || !currentPrize || isSpinningNumber) return;

    setIsSpinningNumber(true);

    let counter = 0;
    const maxIterations = 30;
    const intervalTime = 80;

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      setCurrentNumber(numbers[randomIndex]);
      counter++;

      if (counter > maxIterations) {
        clearInterval(intervalId);
        
        // Final selection
        const finalIndex = Math.floor(Math.random() * numbers.length);
        const winningNumber = numbers[finalIndex];
        setCurrentNumber(winningNumber);
        
        // Update State with result
        setIsSpinningNumber(false);
        
        const newWinner: Winner = {
          id: Date.now(),
          premio: currentPrize,
          numero: winningNumber,
          timestamp: new Date()
        };

        // Update lists
        setWinners(prev => [newWinner, ...prev]);
        
        // IMPORTANT: We must remove only ONE instance of the prize, 
        // because some prizes (like Mochila) appear multiple times.
        setPrizes(prev => {
          const index = prev.indexOf(currentPrize);
          if (index > -1) {
            const newPrizes = [...prev];
            newPrizes.splice(index, 1);
            return newPrizes;
          }
          return prev;
        });

        setNumbers(prev => prev.filter(n => n !== winningNumber));
        
        // Show winner banner
        setShowWinner(true);
        setCurrentPrize(null); // Reset current prize so we have to spin again
        
        // Auto hide banner after 8 seconds
        setTimeout(() => setShowWinner(false), 8000);
      }
    }, intervalTime);
  }, [numbers, currentPrize, isSpinningNumber]);

  const handleReset = useCallback(() => {
    if (window.confirm('¿Estás seguro de reiniciar la tómbola? Se perderán todos los ganadores y el historial.')) {
      setPrizes(INITIAL_PRIZES);
      setNumbers(Array.from(
        { length: INITIAL_NUMBER_COUNT },
        (_, i) => i + INITIAL_NUMBER_START
      ));
      setCurrentPrize(null);
      setCurrentNumber(null);
      setWinners([]);
      setShowWinner(false);
    }
  }, []);

  // --- Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Info Modal */}
        <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

        {/* Header */}
        <header className="relative text-center mb-10 pt-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 flex items-center justify-center gap-4 drop-shadow-md">
            <TrophyIcon className="w-10 h-10 md:w-16 md:h-16 text-yellow-300 animate-bounce" />
            <span>TÓMBOLA 2024</span>
            <TrophyIcon className="w-10 h-10 md:w-16 md:h-16 text-yellow-300 animate-bounce" />
          </h1>
          <p className="text-white text-lg md:text-xl font-light opacity-90 tracking-wide">
            ¡Sorteo de premios en vivo!
          </p>

          {/* Info Button - Absolute positioned on desktop, relative on mobile if needed, but let's keep it simple */}
          <button 
            onClick={() => setShowInfo(true)}
            className="absolute top-0 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Información"
          >
            <InfoIcon className="w-8 h-8" />
          </button>
        </header>

        {/* Winner Announcement */}
        {winners.length > 0 && (
          <WinnerBanner visible={showWinner} winner={winners[0]} />
        )}

        {/* Main Panels */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          
          {/* Prize Panel */}
          <RaffleCard
            title="Premios"
            icon={<GiftIcon className="w-6 h-6 text-pink-500" />}
            remainingCount={prizes.length}
            currentValue={currentPrize}
            isSpinning={isSpinningPrize}
            onSpin={handleSpinPrize}
            disabled={prizes.length === 0 || isSpinningPrize || isSpinningNumber || showWinner}
            themeColor="pink"
            spinButtonText="Girar Premio"
          />

          {/* Number Panel */}
          <RaffleCard
            title="Números"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
            remainingCount={numbers.length}
            currentValue={currentNumber}
            isSpinning={isSpinningNumber}
            onSpin={handleSpinNumber}
            disabled={!currentPrize || numbers.length === 0 || isSpinningNumber || isSpinningPrize}
            themeColor="blue"
            spinButtonText="Girar Número"
          />
        </div>

        {/* Reset Action */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleReset}
            className="group bg-red-500/80 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all backdrop-blur-sm border border-red-400 hover:shadow-lg hover:scale-105"
          >
            <TrashIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Reiniciar Tómbola
          </button>
        </div>

        {/* History */}
        <HistoryList winners={winners} />

        {/* Footer */}
        <footer className="text-center text-white/60 text-sm mt-12 pb-4">
          <p>&copy; {new Date().getFullYear()} Evento Tómbola. Buena suerte a todos.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;