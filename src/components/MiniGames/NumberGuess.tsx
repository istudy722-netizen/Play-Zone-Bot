import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle } from 'lucide-react';

interface NumberGuessProps {
  currentCoins: number;
  onUpdateCoins: (delta: number) => void;
  onClose: () => void;
}

export const NumberGuess: React.FC<NumberGuessProps> = ({
  currentCoins,
  onUpdateCoins,
  onClose
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [botSecret, setBotSecret] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const betAmount = 10;
  const prize = 50; // 5x prize

  const handleGuess = (num: number) => {
    if (isEvaluating) return;
    if (currentCoins < betAmount) {
      alert(`⚠️ Tikish uchun kamida ${betAmount} tanga kerak!`);
      return;
    }

    setSelectedNumber(num);
    setIsEvaluating(true);
    setResultMessage(null);
    onUpdateCoins(-betAmount);

    setTimeout(() => {
      const secret = Math.floor(Math.random() * 6) + 1; // 1 to 6
      setBotSecret(secret);
      setIsEvaluating(false);

      if (num === secret) {
        onUpdateCoins(prize);
        setResultMessage(`🎉 QOYILMAQOM! Bot o'ylagan son: ${secret}. Siz topdingiz va +${prize} tanga yutdingiz! 🚀`);
        confetti({ particleCount: 90, spread: 70 });
      } else {
        setResultMessage(`😢 Bot o'ylagan son ${secret} edi. Siz ${num} ni tanladingiz. Yana urinib ko'ring!`);
      }
    }, 1200);
  };

  return (
    <div className="bg-[#17212b] border border-violet-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-sm tracking-wide">Son Topish (1 dan 6 gacha)</h3>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md">
          Yopish ✕
        </button>
      </div>

      <p className="text-xs text-gray-300 text-center">
        Bot 1 dan 6 gacha bitta son o'ylaydi. To'g'ri topsangiz <strong className="text-amber-400">5 barobar (+{prize} tanga)</strong> yutasiz!
      </p>

      <div className="grid grid-cols-3 gap-2.5">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <button
            key={num}
            type="button"
            disabled={isEvaluating}
            onClick={() => handleGuess(num)}
            className={`py-3.5 rounded-xl font-bold text-lg border transition-all ${
              selectedNumber === num
                ? 'bg-violet-600 border-violet-400 text-white scale-105 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                : 'bg-gray-800 hover:bg-gray-750 border-gray-700 text-gray-200 hover:border-violet-500/50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {resultMessage && (
        <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-center text-xs text-violet-200">
          {resultMessage}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-900/80 p-2.5 rounded-xl">
        <span>Tikish: <strong className="text-amber-400">{betAmount} tanga</strong></span>
        <span>Maksimal yutuq: <strong className="text-emerald-400">{prize} tanga</strong></span>
      </div>
    </div>
  );
};
