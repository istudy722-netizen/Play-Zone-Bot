/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BotConfig, ActiveTab } from './types';
import { initialBotConfig } from './data/defaultConfig';
import { Navbar } from './components/Navbar';
import { TelegramSimulator } from './components/TelegramSimulator';
import { CodeViewer } from './components/CodeViewer';
import { BotConfigurator } from './components/BotConfigurator';
import { SetupGuide } from './components/SetupGuide';
import { AIConsultant } from './components/AIConsultant';
import {
  Gamepad2,
  ShieldCheck,
  Code2,
  Sparkles,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BotConfig>(initialBotConfig);
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  return (
    <div className="min-h-screen bg-[#0a0f16] text-gray-100 flex flex-col font-sans selection:bg-cyan-600 selection:text-white">
      {/* Top Navbar adhering to the strict 3-zone contract */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Hero Banner (Context and value proposition) */}
        <div className="bg-[#111923] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/40 uppercase tracking-wider">
                  Telegram Bot Konstruktori
                </span>
                <span className="text-xs text-gray-400">
                  Majburiy Obuna + Mini-O'yinlar Tizimi
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {config.botName} — To'liq Ishchi Telegram Boti
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Foydalanuvchilar o'yin o'ynashdan oldin Telegram kanallaringizga majburiy a'zo bo'ladi.
                Obunani tekshirish, tasdiqlash, o'yinlar zali va to'liq <b>Python (Aiogram 3 / Telebot)</b> hamda <b>Node.js</b> kodlari tayyor!
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#182330] border border-gray-700/80 rounded-2xl p-3 text-center min-w-[100px]">
                <div className="text-xs text-gray-400 font-medium">Kanallar</div>
                <div className="text-base font-bold text-cyan-400">{config.channels.length} ta</div>
              </div>
              <div className="bg-[#182330] border border-gray-700/80 rounded-2xl p-3 text-center min-w-[100px]">
                <div className="text-xs text-gray-400 font-medium">O'yinlar</div>
                <div className="text-base font-bold text-amber-400">5 xil</div>
              </div>
              <div className="bg-[#182330] border border-gray-700/80 rounded-2xl p-3 text-center min-w-[100px]">
                <div className="text-xs text-gray-400 font-medium">Kutubxona</div>
                <div className="text-base font-bold text-emerald-400">Aiogram 3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <TelegramSimulator config={config} />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <CodeViewer config={config} />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <BotConfigurator config={config} onChangeConfig={setConfig} />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6">
            <SetupGuide />
          </div>
        )}

        {activeTab === 'ai_assistant' && (
          <div className="space-y-6">
            <AIConsultant config={config} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0e141c] border-t border-gray-900 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>PlayZoneBot Telegram Majburiy Obuna Tizimi</span>
          <span>Python (aiogram 3, pyTelegramBotAPI) • Node.js (Telegraf)</span>
        </div>
      </footer>
    </div>
  );
}
