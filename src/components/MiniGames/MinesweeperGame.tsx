import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Bomb, Gem } from 'lucide-react';

interface MinesweeperGameProps {
  currentCoins: number;
  onUpdateCoins: (delta: number) => void;
  onClose: () => void;
}

export const MinesweeperGame: React.FC<MinesweeperGameProps> = ({
  currentCoins,
  onUpdateCoins,
  onClose
}) => {
  const [grid, setGrid] = useState<Array<{ hasBomb: boolean; revealed: boolean }>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gemsFound, setGemsFound] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameOver, setGameOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const betAmount = 25;

  const startGame = () => {
    if (currentCoins < betAmount) {
      alert(`⚠️ Boshlash uchun kamida ${betAmount} tanga kerak!`);
      return;
    }

    onUpdateCoins(-betAmount);

    // 12 cells, 3 bombs, 9 gems
    const bombsIndices = new Set<number>();
    while (bombsIndices.size < 3) {
      bombsIndices.add(Math.floor(Math.random() * 12));
    }

    const newGrid = Array.from({ length: 12 }, (_, i) => ({
      hasBomb: bombsIndices.has(i),
      revealed: false
    }));

    setGrid(newGrid);
    setIsPlaying(true);
    setGemsFound(0);
    setMultiplier(1.0);
    setGameOver(false);
    setStatusMessage('Olmoslarni toping! Har bir olmos yutuqni oshiradi. 💎');
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || gameOver || grid[index].revealed) return;

    const newGrid = [...grid];
    newGrid[index].revealed = true;
    setGrid(newGrid);

    if (newGrid[index].hasBomb) {
      // Hit bomb
      // Reveal all bombs
      newGrid.forEach(c => {
        if (c.hasBomb) c.revealed = true;
      });
      setGameOver(true);
      setIsPlaying(false);
      setStatusMessage(`💣 BOOOM! Minaga tushdingiz! -${betAmount} tanga.`);
    } else {
      // Found gem
      const nextGems = gemsFound + 1;
      const nextMult = Number((1 + nextGems * 0.45).toFixed(2));
      setGemsFound(nextGems);
      setMultiplier(nextMult);

      if (nextGems === 9) {
        // Won all!
        const totalWin = Math.floor(betAmount * nextMult);
        onUpdateCoins(totalWin);
        setGameOver(true);
        setIsPlaying(false);
        setStatusMessage(`🏆 Barcha olmoslarni topdingiz! +${totalWin} tanga!`);
        confetti({ particleCount: 100, spread: 80 });
      } else {
        setStatusMessage(`💎 Olmos topildi (${nextGems}/9)! Joriy ko'paytma: x${nextMult}`);
      }
    }
  };

  const handleCashout = () => {
    if (!isPlaying || gemsFound === 0) return;
    const totalWin = Math.floor(betAmount * multiplier);
    onUpdateCoins(totalWin);
    setIsPlaying(false);
    setGameOver(true);
    setStatusMessage(`💰 Muvaffaqiyatli yechib olindi: +${totalWin} tanga (x${multiplier})!`);
    confetti({ particleCount: 60, spread: 50 });
  };

  return (
    <div className="bg-[#17212b] border border-emerald-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Bomb className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm tracking-wide">Minavor O'yini (Mines)</h3>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md">
          Yopish ✕
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {grid.length > 0 ? (
          grid.map((cell, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCellClick(idx)}
              disabled={!isPlaying || cell.revealed}
              className={`h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                !cell.revealed
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600 active:scale-95'
                  : cell.hasBomb
                  ? 'bg-red-900/80 border border-red-500 text-red-300'
                  : 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              }`}
            >
              {cell.revealed ? (cell.hasBomb ? '💣' : '💎') : '?'}
            </button>
          ))
        ) : (
          <div className="col-span-4 py-8 text-center text-xs text-gray-400 bg-gray-900/70 rounded-xl">
            O'yinni boshlash uchun pastdagi tugmani bosing 👇
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-center text-xs text-emerald-300">
          {statusMessage}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-900/80 p-2.5 rounded-xl">
        <span>Yutuq: <strong className="text-emerald-400">{Math.floor(betAmount * multiplier)} tanga</strong></span>
        <span>Ko'paytma: <strong className="text-amber-400">x{multiplier}</strong></span>
      </div>

      {!isPlaying ? (
        <button
          onClick={startGame}
          disabled={currentCoins < betAmount}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Gem className="w-4 h-4" />
          Yangi o'yin boshlash ({betAmount} tanga)
        </button>
      ) : (
        <button
          onClick={handleCashout}
          disabled={gemsFound === 0}
          className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          Yutuqni olish: {Math.floor(betAmount * multiplier)} tanga (x{multiplier})
        </button>
      )}
    </div>
  );
};
