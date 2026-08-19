import React, { useState } from 'react';
import { guideSteps, commonErrorsFAQ } from '../data/defaultConfig';
import {
  BookOpen,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Terminal,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-cyan-900/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 rounded-2xl p-6 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold">Telegram Botni Ishga Tushirish Qo'llanmasi</h2>
        </div>
        <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
          Ushbu qo'llanma orqali @BotFather'dan token olishdan tortib, kanallarga botni admin qilish va Linux VPS serverda 24/7 rejimda ishga tushirishgacha bo'lgan barcha bosqichlarni o'rganasiz.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {guideSteps.map((step) => (
          <div
            key={step.step}
            className="bg-[#17212b] border border-gray-800 rounded-2xl p-5 text-white shadow-lg space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 font-bold flex items-center justify-center text-sm shrink-0">
                {step.step}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-gray-100">{step.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            </div>

            {step.codeExample && (
              <div className="bg-[#0e1621] border border-gray-700/80 rounded-xl p-3 font-mono text-xs text-gray-200 overflow-x-auto whitespace-pre leading-relaxed">
                {step.codeExample}
              </div>
            )}

            {step.tip && (
              <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-2 rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span><strong>Maslahat:</strong> {step.tip}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Errors & FAQ */}
      <div className="bg-[#17212b] border border-gray-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <h2 className="font-semibold text-base">Ko'p Uchraydigan Xatolar va Ularning Yechimi (FAQ)</h2>
        </div>

        <div className="space-y-2.5">
          {commonErrorsFAQ.map((faq, idx) => {
            const isOpen = openFAQ === idx;
            return (
              <div
                key={idx}
                className="bg-[#0e1621] border border-gray-700/80 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-semibold text-gray-100 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-gray-300 border-t border-gray-800/80 leading-relaxed bg-[#111a24]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
