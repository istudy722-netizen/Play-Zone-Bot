import React, { useState } from 'react';
import { BotConfig } from '../types';
import { GoogleGenAI } from '@google/genai';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Terminal,
  Code2,
  Lightbulb
} from 'lucide-react';

interface AIConsultantProps {
  config: BotConfig;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ config }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: `Salom! Men sizning Telegram Bot bo'yicha shaxsiy AI maslahatchisiman. 🤖\n\nPlayZone botingizga yangi funksiyalar qo'shish, majburiy obuna xatoliklarini to'g'rilash, ma'lumotlar bazasi (SQLite/PostgreSQL) ulash yoki yangi o'yinlar yaratish bo'yicha istalgan savolingizni berishingiz mumkin!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedPrompts = [
    "Botga yangi mini-o'yin (masalan: Viktoriya yoki Kazino) qanday qo'shaman?",
    "Kanalda bot admin bo'lmasa qanday xatolik chiqadi va qanday tuzatiladi?",
    "Foydalanuvchilar hisobini SQLite bazasida saqlash uchun tayyor kod ber",
    "Botni PythonAnywhere bepul hostingiga qanday yuklayman?"
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuery).trim();
    if (!q || isLoading) return;

    if (!questionText) setInputQuery('');

    const userMsg: ChatMessage = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key topilmadi");
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Siz professional Telegram Bot muhandisisiz (Python aiogram 3, pyTelegramBotAPI, Node.js Telegraf). 
Foydalanuvchiga Telegram botlar, majburiy kanal obunasi (getChatMember), xavfsizlik, o'yinlar yaratish va serverga joylashtirish bo'yicha to'liq, tushunarli, o'zbek tilida sifatli kod namunalari va yechimlar bering.
Botingiz nomi: ${config.botName}, kanallar: ${config.channels.map(c => c.username).join(', ')}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nFoydalanuvchi savoli: ${q}` }] }
        ]
      });

      const replyText = response.text || "Kechirasiz, javob olishda xatolik yuz berdi.";

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      // Fallback helpful offline responses
      let fallbackText = `Sizning savolingiz: "${q}"\n\n`;
      if (q.toLowerCase().includes("o'yin") || q.toLowerCase().includes("oyin")) {
        fallbackText += `🎮 **Yangi o'yin qo'shish bo'yicha tavsiya:**\nAiogram 3 da yangi CallbackQuery handler qo'shing:\n\`\`\`python\n@dp.callback_query(F.data == "game_quiz")\nasync def play_quiz(call: CallbackQuery):\n    # Savol va javoblar varianti\n    await call.message.answer("Savol: O'zbekiston poytaxti qaysi shahar?")\n\`\`\``;
      } else if (q.toLowerCase().includes("admin") || q.toLowerCase().includes("kanal")) {
        fallbackText += `⚠️ **Kanal va Admin ruxsatlari:**\nBot kanaldagi a'zolikni bilishi uchun bot o'sha kanalda administrator bo'lishi shart. Telegram BotFather orqali token olingach, kanalingizga kirib 'Add Administrator' qiling.`;
      } else {
        fallbackText += `Telegram botingiz bo'yicha barcha tayyor kodlar "Kodlar" bo'limida to'liq keltirilgan. Agar serverda xatolik chiqsa \`pip install -r requirements.txt\` ni qayta ishlatib ko'ring.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#17212b] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="bg-[#111923] border-b border-gray-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Telegram Bot Maslahatchi</h2>
            <p className="text-[11px] text-gray-400">Telegram bot kodlari va muammolarini hal qilish yordamchisi</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-[#182330] border-b border-gray-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-gray-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Tezkor savollar:
        </span>
        {predefinedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] bg-[#0e1621] hover:bg-gray-800 text-gray-300 hover:text-cyan-300 border border-gray-700/60 rounded-lg px-2.5 py-1 shrink-0 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0e1621]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 text-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-700 text-white rounded-br-none'
                  : 'bg-[#182533] text-gray-200 border border-gray-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-cyan-200' : 'text-gray-500'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 text-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#182533] p-3 rounded-2xl w-fit border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI javob tayyorlamoqda...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#111923] border-t border-gray-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Telegram bot bo'yicha istalgan savol yoki kod so'rang..."
          className="flex-1 bg-[#0e1621] text-white text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:border-cyan-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Yuborish</span>
        </button>
      </form>
    </div>
  );
};
