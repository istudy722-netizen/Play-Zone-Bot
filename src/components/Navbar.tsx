import React from 'react';
import { ActiveTab } from '../types';
import {
  Gamepad2,
  Code2,
  Settings,
  BookOpen,
  Sparkles,
  Download
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="bg-[#111923] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Strictly one text element) */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-white font-bold text-base tracking-tight whitespace-nowrap">
            PlayZoneBot Studio
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Simulyator</span>
          </button>

          <button
            onClick={() => onSelectTab('code')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Bot Kodlari</span>
          </button>

          <button
            onClick={() => onSelectTab('config')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sozlamalar</span>
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Qo'llanma</span>
          </button>

          <button
            onClick={() => onSelectTab('ai_assistant')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai_assistant'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Yordamchi</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('code')}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kodni Olish</span>
          </button>
        </div>

      </div>
    </header>
  );
};
