import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices } from 'lucide-react';

interface DiceRollProps {
  currentCoins: number;
  onUpdateCoins: (delta: number) => void;
  onClose: () => void;
}

export const DiceRoll: React.FC<DiceRollProps> = ({
  currentCoins,
  onUpdateCoins,
  onClose
}) => {
  const [userRoll, setUserRoll] = useState<number | null>(null);
  const [botRoll, setBotRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const betAmount = 20;

  const handleRoll = () => {
    if (isRolling) return;
    if (currentCoins < betAmount) {
      alert(`⚠️ Tikish uchun kamida ${betAmount} tanga kerak!`);
      return;
    }

    setIsRolling(true);
    setGameResult(null);
    onUpdateCoins(-betAmount);

    let counter = 0;
    const interval = setInterval(() => {
      setUserRoll(Math.floor(Math.random() * 6) + 1);
      setBotRoll(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalUser = Math.floor(Math.random() * 6) + 1;
        const finalBot = Math.floor(Math.random() * 6) + 1;
        setUserRoll(finalUser);
        setBotRoll(finalBot);
        setIsRolling(false);

        if (finalUser > finalBot) {
          const prize = betAmount * 2;
          onUpdateCoins(prize);
          setGameResult(`G'alaba! +${prize} tanga yutib oldingiz! 🎉`);
          confetti({ particleCount: 60, spread: 60 });
        } else if (finalUser < finalBot) {
          setGameResult(`Mag'lubiyat! Bot zarlari ustun keldi (-${betAmount} tanga) 🤖`);
        } else {
          onUpdateCoins(betAmount);
          setGameResult("Durang! Tangalaringiz qaytarildi 🤝");
        }
      }
    }, 100);
  };

  const renderDiceFace = (val: number | null) => {
    if (!val) return <span className="text-3xl text-gray-500">?</span>;
    const dots: Record<number, string> = {
      1: "⚀",
      2: "⚁",
      3: "⚂",
      4: "⚃",
      5: "⚄",
      6: "⚅"
    };
    return <span className="text-5xl font-mono text-cyan-400 select-none">{dots[val] || val}</span>;
  };

  return (
    <div className="bg-[#17212b] border border-cyan-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide">Zar Tashlash (Dice Battle)</h3>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md">
          Yopish ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 py-2">
        <div className="bg-gray-900/90 border border-cyan-500/40 rounded-xl p-3 text-center flex flex-col items-center justify-center min-h-[110px]">
          <span className="text-xs text-gray-400 mb-1">Sizning Zaringiz</span>
          <div className={`transition-transform duration-100 ${isRolling ? 'rotate-12 scale-110' : ''}`}>
            {renderDiceFace(userRoll)}
          </div>
          {userRoll && <span className="text-xs font-bold text-cyan-300 mt-1">{userRoll} ball</span>}
        </div>

        <div className="bg-gray-900/90 border border-purple-500/40 rounded-xl p-3 text-center flex flex-col items-center justify-center min-h-[110px]">
          <span className="text-xs text-gray-400 mb-1">Botning Zari</span>
          <div className={`transition-transform duration-100 ${isRolling ? '-rotate-12 scale-110' : ''}`}>
            {renderDiceFace(botRoll)}
          </div>
          {botRoll && <span className="text-xs font-bold text-purple-300 mt-1">{botRoll} ball</span>}
        </div>
      </div>

      {gameResult && (
        <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-center text-xs text-cyan-200">
          {gameResult}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-900/80 p-2.5 rounded-xl">
        <span>Tikish narxi: <strong className="text-amber-400">{betAmount} tanga</strong></span>
        <span>Yutuq: <strong className="text-emerald-400">{betAmount * 2} tanga</strong></span>
      </div>

      <button
        onClick={handleRoll}
        disabled={isRolling || currentCoins < betAmount}
        className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <Dices className={`w-4 h-4 ${isRolling ? 'animate-bounce' : ''}`} />
        {isRolling ? "Zarlar tashlanmoqda..." : "Zarni tashlash (20 tanga)"}
      </button>
    </div>
  );
};
