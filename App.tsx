
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
                    
                    // Auto hide banner later
                    setTimeout(() => setShowWinner(false), 8000);
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
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Prize Panel */}
          <RaffleCard
            title="Premios"
            icon={<GiftIcon className="w-6 h-6 text-pink-500" />}
            remainingCount={prizes.length}
            currentValue={currentPrize}
            isSpinning={isSpinningPrize}
            disabled={true} // Controlled by auto spin
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
            disabled={true} // Controlled by auto spin
            themeColor="blue"
            spinButtonText="Girar Número"
            hideButton={true}
          />
        </div>

        {/* BIG CENTRAL BUTTON */}
        <div className="flex justify-center mb-12">
           <button
             onClick={handleAutoSpin}
             disabled={isGameActive || isGameOver || showWinner}
             className={`
               group relative overflow-hidden rounded-full py-6 px-16
               bg-gradient-to-r from-yellow-400 to-orange-500
               text-white font-black text-2xl md:text-4xl shadow-2xl
               transform transition-all duration-300
               ${isGameActive || isGameOver || showWinner
                 ? 'opacity-50 grayscale cursor-not-allowed scale-95' 
                 : 'hover:scale-110 hover:shadow-orange-500/50 hover:rotate-1 active:scale-95'
               }
             `}
           >
             <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12 origin-left"></div>
             <div className="flex items-center gap-4 relative z-10 uppercase tracking-widest">
                <RotateCwIcon className={`w-8 h-8 md:w-10 md:h-10 ${isGameActive ? 'animate-spin' : ''}`} />
                {isGameActive ? 'Sorteando...' : (isGameOver ? 'Fin del Sorteo' : '¡SORTEAR!')}
             </div>
           </button>
        </div>

        {/* Reset Action */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleReset}
            className="group bg-red-500/80 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all backdrop-blur-sm border border-red-400 hover:shadow-lg hover:scale-105 active:scale-95 text-sm"
          >
            <TrashIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Reiniciar Todo
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
