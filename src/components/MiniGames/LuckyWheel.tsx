import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCw, Sparkles, Award } from 'lucide-react';

interface LuckyWheelProps {
  currentCoins: number;
  onUpdateCoins: (delta: number) => void;
  onClose: () => void;
}

const SECTORS = [
  { label: "+100", value: 100, color: "#10b981", textColor: "#ffffff" },
  { label: "+20", value: 20, color: "#3b82f6", textColor: "#ffffff" },
  { label: "0", value: 0, color: "#6b7280", textColor: "#ffffff" },
  { label: "+50", value: 50, color: "#8b5cf6", textColor: "#ffffff" },
  { label: "+200", value: 200, color: "#f59e0b", textColor: "#ffffff" },
  { label: "-10", value: -10, color: "#ef4444", textColor: "#ffffff" },
  { label: "+30", value: 30, color: "#06b6d4", textColor: "#ffffff" },
  { label: "JACKPOT +500", value: 500, color: "#ec4899", textColor: "#ffffff" },
];

export const LuckyWheel: React.FC<LuckyWheelProps> = ({
  currentCoins,
  onUpdateCoins,
  onClose
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ label: string; value: number } | null>(null);
  const costPerSpin = 15;

  const handleSpin = () => {
    if (isSpinning) return;
    if (currentCoins < costPerSpin) {
      alert(`⚠️ Tangalaringiz yetarli emas! Aylantirish narxi: ${costPerSpin} tanga`);
      return;
    }

    setIsSpinning(true);
    setResult(null);
    onUpdateCoins(-costPerSpin);

    // Pick winning sector
    const randomIndex = Math.floor(Math.random() * SECTORS.length);
    const sectorAngle = 360 / SECTORS.length;
    
    // Add multiple full turns (5-8 turns)
    const extraTurns = (5 + Math.floor(Math.random() * 4)) * 360;
    // Calculate angle for the winning sector (top pointer is at 270 deg or 0 deg offset)
    const targetSectorAngle = 360 - (randomIndex * sectorAngle + sectorAngle / 2);
    const finalRotation = rotation + extraTurns + targetSectorAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonSector = SECTORS[randomIndex];
      setResult(wonSector);
      onUpdateCoins(wonSector.value);

      if (wonSector.value > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 4000);
  };

  return (
    <div className="bg-[#17212b] border border-cyan-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-sm tracking-wide">Omad G'ildiragi (Lucky Wheel)</h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded-md"
        >
          Yopish ✕
        </button>
      </div>

      <div className="relative flex justify-center items-center py-3">
        {/* Top Pointer */}
        <div className="absolute top-1 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

        {/* Wheel Container */}
        <div
          className="w-56 h-56 rounded-full border-4 border-amber-400/80 shadow-2xl relative overflow-hidden transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '4000ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {SECTORS.map((sector, index) => {
              const count = SECTORS.length;
              const angle = 360 / count;
              const startAngle = index * angle;
              const endAngle = (index + 1) * angle;

              // Convert to radians
              const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              // Text position
              const textAngle = startAngle + angle / 2 - 90;
              const textRad = (Math.PI * textAngle) / 180;
              const tx = 50 + 32 * Math.cos(textRad);
              const ty = 50 + 32 * Math.sin(textRad);

              return (
                <g key={index}>
                  <path d={pathData} fill={sector.color} stroke="#0e1621" strokeWidth="0.8" />
                  <text
                    x={tx}
                    y={ty}
                    fill={sector.textColor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                  >
                    {sector.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg">
            <RotateCw className={`w-5 h-5 text-amber-400 ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 text-center text-xs animate-fade-in">
          <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold">
            <Award className="w-4 h-4" />
            <span>Natija: {result.label} tanga!</span>
          </div>
          <p className="text-gray-300 mt-0.5">
            {result.value > 0 ? `Hisobingizga +${result.value} tanga qo'shildi! 🎊` : "Keyingi safar albatta omad keladi! 🍀"}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-900/80 p-2.5 rounded-xl">
        <span>Aylantirish narxi: <strong className="text-amber-400">{costPerSpin} tanga</strong></span>
        <span>Mavjud: <strong className="text-emerald-400">{currentCoins} tanga</strong></span>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || currentCoins < costPerSpin}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? "G'ildirak aylanmoqda..." : "Omadni sinash (15 tanga)"}
      </button>
    </div>
  );
};
