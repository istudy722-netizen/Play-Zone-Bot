import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coins } from 'lucide-react';

interface CoinFlipProps {
  currentCoins: number;
  onUpdateCoins: (delta: number) => void;
  onClose: () => void;
}

export const CoinFlip: React.FC<CoinFlipProps> = ({
  currentCoins,
  onUpdateCoins,
  onClose
}) => {
  const [selectedSide, setSelectedSide] = useState<'eagle' | 'tails'>('eagle');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'eagle' | 'tails' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const betAmount = 15;

  const handleFlip = () => {
    if (isFlipping) return;
    if (currentCoins < betAmount) {
      alert(`⚠️ Tikish uchun kamida ${betAmount} tanga kerak!`);
      return;
    }

    setIsFlipping(true);
    setMessage(null);
    setResult(null);
    onUpdateCoins(-betAmount);

    setTimeout(() => {
      const outcome: 'eagle' | 'tails' = Math.random() > 0.5 ? 'eagle' : 'tails';
      setResult(outcome);
      setIsFlipping(false);

      if (outcome === selectedSide) {
        const prize = betAmount * 2;
        onUpdateCoins(prize);
        setMessage(`🎉 Tabriklaymiz! ${outcome === 'eagle' ? 'BURGUT 🦅' : 'RAQAM 🔢'} tushdi! +${prize} tanga yutdingiz!`);
        confetti({ particleCount: 70, spread: 60 });
      } else {
        setMessage(`😢 Afsus! ${outcome === 'eagle' ? 'BURGUT 🦅' : 'RAQAM 🔢'} tushdi. Omad keyingi safar keladi!`);
      }
    }, 1800);
  };

  return (
    <div className="bg-[#17212b] border border-amber-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-sm tracking-wide">Tanga Tashlash (Coin Flip)</h3>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md">
          Yopish ✕
        </button>
      </div>

      <div className="flex justify-center py-4">
        <div
          className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black transition-all ${
            isFlipping ? 'animate-spin' : ''
          }`}
        >
          {result === 'eagle' || (!result && selectedSide === 'eagle') ? (
            <>
              <span className="text-3xl">🦅</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Burgut</span>
            </>
          ) : (
            <>
              <span className="text-3xl">🔢</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Raqam</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400">Tanlovingizni belgilang:</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isFlipping}
            onClick={() => setSelectedSide('eagle')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedSide === 'eagle'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <span>🦅</span> Burgut (Heads)
          </button>
          <button
            type="button"
            disabled={isFlipping}
            onClick={() => setSelectedSide('tails')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedSide === 'tails'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <span>🔢</span> Raqam (Tails)
          </button>
        </div>
      </div>

      {message && (
        <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-center text-xs text-amber-200">
          {message}
        </div>
      )}

      <button
        onClick={handleFlip}
        disabled={isFlipping || currentCoins < betAmount}
        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <Coins className="w-4 h-4" />
        {isFlipping ? "Tanga aylanmoqda..." : `Tangani tashlash (${betAmount} tanga)`}
      </button>
    </div>
  );
};
