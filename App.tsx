
import React, { useState, useCallback } from 'react';
import { INITIAL_PRIZES, INITIAL_NUMBER_START, INITIAL_NUMBER_COUNT } from './constants';
import { Winner } from './types';
import { GiftIcon, UsersIcon, TrophyIcon, TrashIcon, InfoIcon, RotateCwIcon } from './components/Icons';
import WinnerBanner from './components/WinnerBanner';
import RaffleCard from './components/RaffleCard';
import HistoryList from './components/HistoryList';
import InfoModal from './components/InfoModal';

const App: React.FC = () => {
  // --- State ---
  const [prizes, setPrizes] = useState<string[]>(INITIAL_PRIZES);
  
  // Initialize numbers lazily
  const [numbers, setNumbers] = useState<number[]>(() => 
    Array.from({ length: INITIAL_NUMBER_COUNT }, (_, i) => i + INITIAL_NUMBER_START)
  );
  
  const [currentPrize, setCurrentPrize] = useState<string | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  
  const [isSpinningPrize, setIsSpinningPrize] = useState(false);
  const [isSpinningNumber, setIsSpinningNumber] = useState(false);
  
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // --- Handlers ---

  const handleAutoSpin = useCallback(() => {
    // Prevent spin if invalid state
    if (prizes.length === 0 || numbers.length === 0 || isSpinningPrize || isSpinningNumber || showWinner) return;

    // Reset previous winner view
    setShowWinner(false);
    setCurrentPrize(null);
    setCurrentNumber(null);

    // --- STEP 1: SPIN PRIZE ---
    setIsSpinningPrize(true);

    let prizeCounter = 0;
    const prizeMaxIterations = 20;
    const prizeIntervalTime = 80;

    const prizeInterval = setInterval(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setCurrentPrize(randomPrize);
      prizeCounter++;

      if (prizeCounter > prizeMaxIterations) {
        clearInterval(prizeInterval);
        
        // Final Prize Selection
        const finalPrizeIndex = Math.floor(Math.random() * prizes.length);
        const finalPrize = prizes[finalPrizeIndex];
        setCurrentPrize(finalPrize);
        setIsSpinningPrize(false);

        // --- STEP 2: WAIT & SPIN NUMBER ---
        setTimeout(() => {
            setIsSpinningNumber(true);
            
            let numberCounter = 0;
            const numberMaxIterations = 30;
            const numberIntervalTime = 60;

            const numberInterval = setInterval(() => {
                const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
                setCurrentNumber(randomNumber);
                numberCounter++;

                if (numberCounter > numberMaxIterations) {
                    clearInterval(numberInterval);

                    // Final Number Selection
                    const finalNumberIndex = Math.floor(Math.random() * numbers.length);
                    const finalNumber = numbers[finalNumberIndex];
                    setCurrentNumber(finalNumber);
                    setIsSpinningNumber(false);

                    // --- STEP 3: REGISTER WINNER ---
                    const newWinner: Winner = {
                        id: Date.now(),
                        premio: finalPrize,
                        numero: finalNumber,
                        timestamp: new Date()
                    };

                    setWinners(prev => [newWinner, ...prev]);

                    // Remove used items
                    setPrizes(prev => {
                        // Remove only ONE instance of the prize
                        const index = prev.indexOf(finalPrize);
                        if (index > -1) {
                            const newPrizes = [...prev];
                            newPrizes.splice(index, 1);
                            return newPrizes;
                        }
                        return prev;
                    });

                    setNumbers(prev => prev.filter(n => n !== finalNumber));

                    // Show Banner
                    setShowWinner(true);
                    
                    // Auto hide banner later (optional, keeps UI clean)
                    // setTimeout(() => setShowWinner(false), 8000);
                }
            }, numberIntervalTime);

        }, 500); // 0.5s delay between prize and number
      }
    }, prizeIntervalTime);

  }, [prizes, numbers, isSpinningPrize, isSpinningNumber, showWinner]);

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
  const isGameActive = isSpinningPrize || isSpinningNumber;
  const isGameOver = prizes.length === 0 || numbers.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8 font-sans selection:bg-yellow-300 selection:text-black">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Info Modal */}
        <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

        {/* Header */}
        <header className="relative text-center mb-8 pt-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <TrophyIcon className="w-10 h-10 md:w-16 md:h-16 text-yellow-300 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg tracking-tight">
              TÓMBOLA 2024
            </h1>
            <TrophyIcon className="w-10 h-10 md:w-16 md:h-16 text-yellow-300 animate-bounce" />
          </div>
          <p className="text-white text-lg md:text-xl font-medium opacity-90 tracking-wide uppercase">
            ¡Sorteo de premios en vivo!
          </p>

          <button 
            onClick={() => setShowInfo(true)}
            className="absolute top-0 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
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
            disabled={true} 
            themeColor="pink"
            spinButtonText="Girar Premio"
            hideButton={true}
          />

          {/* Number Panel */}
          <RaffleCard
            title="Números"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
            remainingCount={numbers.length}
            currentValue={currentNumber}
            isSpinning={isSpinningNumber}
            disabled={true}
            themeColor="blue"
            spinButtonText="Girar Número"
            hideButton={true}
          />
        </div>

        {/* SINGLE CENTRAL BUTTON - ACTION AREA */}
        <div className="flex flex-col items-center justify-center mb-12 gap-6">
           <button
             onClick={handleAutoSpin}
             disabled={isGameActive || isGameOver || showWinner}
             className={`
               group relative overflow-hidden rounded-full py-6 px-20
               bg-gradient-to-r from-yellow-400 to-orange-500
               text-white font-black text-3xl md:text-5xl shadow-[0_0_40px_rgba(251,191,36,0.6)]
               transform transition-all duration-300
               border-4 border-yellow-200
               ${isGameActive || isGameOver || showWinner
                 ? 'opacity-60 grayscale cursor-not-allowed scale-95' 
                 : 'hover:scale-105 hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] hover:-translate-y-1 active:scale-95 active:translate-y-1'
               }
             `}
           >
             <div className="absolute inset-0 bg-white/30 group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12 origin-left"></div>
             <div className="flex items-center gap-4 relative z-10 uppercase tracking-widest drop-shadow-md">
                <RotateCwIcon className={`w-8 h-8 md:w-12 md:h-12 ${isGameActive ? 'animate-spin' : ''}`} />
                <span>{isGameActive ? 'Sorteando...' : (isGameOver ? 'Fin del Sorteo' : '¡SORTEAR!')}</span>
             </div>
           </button>

           {/* Small Reset Button underneath */}
           <button
            onClick={handleReset}
            className="text-white/60 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Reiniciar Tómbola
          </button>
        </div>

        {/* History */}
        <HistoryList winners={winners} />

        {/* Footer */}
        <footer className="text-center text-white/50 text-sm mt-12 pb-4">
          <p>&copy; {new Date().getFullYear()} Evento Tómbola</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
