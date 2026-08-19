import React, { useState } from 'react';
import { BotConfig } from '../types';
import {
  generateAiogram3Code,
  generateTelebotCode,
  generateNodeJsCode,
  generateDatabasePy,
  generateRequirementsTxt,
  generateEnvFile
} from '../utils/codeGenerator';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

interface CodeViewerProps {
  config: BotConfig;
}

type FileTab = 'aiogram' | 'telebot' | 'nodejs' | 'database' | 'requirements' | 'env';

export const CodeViewer: React.FC<CodeViewerProps> = ({ config }) => {
  const [activeFile, setActiveFile] = useState<FileTab>('aiogram');
  const [copied, setCopied] = useState(false);

  const getCode = (tab: FileTab): { filename: string; content: string; lang: string } => {
    switch (tab) {
      case 'aiogram':
        return {
          filename: 'bot.py (Aiogram 3)',
          content: generateAiogram3Code(config),
          lang: 'python'
        };
      case 'telebot':
        return {
          filename: 'bot_telebot.py (Telebot)',
          content: generateTelebotCode(config),
          lang: 'python'
        };
      case 'nodejs':
        return {
          filename: 'bot.js (Telegraf Node.js)',
          content: generateNodeJsCode(config),
          lang: 'javascript'
        };
      case 'database':
        return {
          filename: 'database.py (SQLite)',
          content: generateDatabasePy(),
          lang: 'python'
        };
      case 'requirements':
        return {
          filename: 'requirements.txt',
          content: generateRequirementsTxt(),
          lang: 'text'
        };
      case 'env':
        return {
          filename: '.env',
          content: generateEnvFile(config),
          lang: 'text'
        };
    }
  };

  const currentFileData = getCode(activeFile);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentFileData.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = currentFileData.filename.split(' ')[0];
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#17212b] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Top action header */}
      <div className="bg-[#111923] border-b border-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white text-sm">Tayyor Telegram Bot Kodlari</h2>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
            100% Ishchi
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="py-1.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-gray-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Nusxalandi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Nusxa olish</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Faylni yuklash</span>
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="bg-[#182330] border-b border-gray-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveFile('aiogram')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'aiogram'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>bot.py (Aiogram 3 Tavsiya)</span>
        </button>

        <button
          onClick={() => setActiveFile('telebot')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'telebot'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>bot_telebot.py (Telebot)</span>
        </button>

        <button
          onClick={() => setActiveFile('nodejs')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'nodejs'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>bot.js (Node.js)</span>
        </button>

        <button
          onClick={() => setActiveFile('database')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'database'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>database.py</span>
        </button>

        <button
          onClick={() => setActiveFile('requirements')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'requirements'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-orange-400" />
          <span>requirements.txt</span>
        </button>

        <button
          onClick={() => setActiveFile('env')}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFile === 'env'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span>.env</span>
        </button>
      </div>

      {/* Code Display Area */}
      <div className="relative bg-[#0d141d] p-4 overflow-x-auto max-h-[640px]">
        <pre className="font-mono text-xs text-gray-200 leading-relaxed whitespace-pre selection:bg-cyan-900 selection:text-white">
          <code>{currentFileData.content}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-[#111923] border-t border-gray-800 px-4 py-2.5 flex items-center justify-between text-xs text-gray-400">
        <span>Fayl: <code className="text-cyan-400">{currentFileData.filename}</code></span>
        <span>Kutubxona: {activeFile === 'aiogram' ? 'aiogram 3.15+' : activeFile === 'telebot' ? 'pyTelegramBotAPI' : 'Telegraf.js'}</span>
      </div>
    </div>
  );
};
