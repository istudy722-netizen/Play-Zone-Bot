import React, { useState, useRef, useEffect } from 'react';
import { BotConfig, MessageItem, TelegramUser } from '../types';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Gamepad2,
  Gift,
  Coins,
  Users,
  Trophy,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LuckyWheel } from './MiniGames/LuckyWheel';
import { DiceRoll } from './MiniGames/DiceRoll';
import { CoinFlip } from './MiniGames/CoinFlip';
import { MinesweeperGame } from './MiniGames/MinesweeperGame';
import { NumberGuess } from './MiniGames/NumberGuess';

interface TelegramSimulatorProps {
  config: BotConfig;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ config }) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState<TelegramUser>({
    id: 994821034,
    firstName: "Azizbek",
    username: "azizbek_gamer",
    coins: config.initialCoins,
    isSubscribedChannels: {},
    referralCount: 0,
    gamesPlayed: 0,
    gamesWon: 0
  });

  const [activeGame, setActiveGame] = useState<'wheel' | 'dice' | 'coin' | 'mines' | 'guess' | null>(null);
  const [telegramToast, setTelegramToast] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize simulation on mount or reset
  useEffect(() => {
    handleReset();
  }, [config.botName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping, activeGame]);

  const showToast = (text: string) => {
    setTelegramToast(text);
    setTimeout(() => {
      setTelegramToast(null);
    }, 3500);
  };

  const getSubscribedCount = () => {
    return config.channels.filter(c => user.isSubscribedChannels[c.id]).length;
  };

  const areAllChannelsSubscribed = () => {
    return config.channels.every(c => user.isSubscribedChannels[c.id]);
  };

  const toggleChannelSubscription = (channelId: string) => {
    setUser(prev => {
      const nextState = !prev.isSubscribedChannels[channelId];
      return {
        ...prev,
        isSubscribedChannels: {
          ...prev.isSubscribedChannels,
          [channelId]: nextState
        }
      };
    });
  };

  const subscribeToAllChannels = () => {
    const allSubs: Record<string, boolean> = {};
    config.channels.forEach(c => {
      allSubs[c.id] = true;
    });
    setUser(prev => ({
      ...prev,
      isSubscribedChannels: allSubs
    }));
    showToast("✅ Barcha kanallarga muvaffaqiyatli obuna bo'lindi!");
  };

  const unsubscribeFromAll = () => {
    setUser(prev => ({
      ...prev,
      isSubscribedChannels: {}
    }));
    showToast("🔄 Barcha obunalar bekor qilindi (Sinov uchun)");
  };

  const addMessage = (msg: Omit<MessageItem, 'id' | 'time'>) => {
    const newMsg: MessageItem = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...msg
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleReset = () => {
    setMessages([]);
    setActiveGame(null);
    setUser({
      id: 994821034,
      firstName: "Azizbek",
      username: "azizbek_gamer",
      coins: config.initialCoins,
      isSubscribedChannels: {},
      referralCount: 0,
      gamesPlayed: 0,
      gamesWon: 0
    });

    // Auto send /start after a moment
    setTimeout(() => {
      sendStartCommand(false);
    }, 400);
  };

  const sendStartCommand = (checkSubsOverride?: boolean) => {
    const isSub = checkSubsOverride !== undefined ? checkSubsOverride : areAllChannelsSubscribed();
    
    addMessage({
      sender: 'user',
      text: '/start'
    });

    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      if (!isSub) {
        // Not subscribed
        addMessage({
          sender: 'bot',
          text: `Salom, <b>${user.firstName}</b>! 👋\n\n⚠️ <b>${config.botName}</b>dan foydalanish va o'yinlarni boshlash uchun quyidagi rasmiy kanallarimizga a'zo bo'lishingiz shart!\n\nBarcha kanallarga obuna bo'lgach, pastdagi <b>«✅ Tasdiqlash / Tekshirish»</b> tugmasini bosing:`,
          replyMarkup: {
            type: 'inline',
            inlineButtons: [
              ...config.channels.map(c => [
                {
                  text: `📢 ${c.name}`,
                  url: c.inviteUrl || `https://t.me/${c.username.replace('@', '')}`
                }
              ]),
              [
                {
                  text: '✅ Tasdiqlash / Tekshirish',
                  callbackData: 'verify_subscription'
                }
              ]
            ]
          }
        });
      } else {
        // Subscribed
        addMessage({
          sender: 'bot',
          text: `🎉 <b>Xush kelibsiz, ${user.firstName}!</b>\n\n🕹️ <b>${config.botName}</b>ga muvaffaqiyatli kirdingiz.\n💰 Sizning hisobingiz: <b>${user.coins} tanga</b>\n\nQuyidagi menyudan kerakli bo'limni tanlang 👇`,
          replyMarkup: {
            type: 'keyboard',
            keyboardButtons: [
              [{ text: "🎮 O'yinlar" }, { text: "🎁 Kunlik bonus" }],
              [{ text: "💰 Balans & Hamyon" }, { text: "👥 Do'stlarni taklif qilish" }],
              [{ text: "🏆 Reyting" }, { text: "ℹ️ Bot haqida" }]
            ]
          }
        });
      }
    }, 600);
  };

  const handleVerifySubscription = () => {
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      const isSub = areAllChannelsSubscribed();

      if (isSub) {
        showToast("✅ Obunangiz muvaffaqiyatli tasdiqlandi!");
        confetti({ particleCount: 70, spread: 60 });

        addMessage({
          sender: 'bot',
          text: `🎉 <b>Ajoyib, ${user.firstName}! Obuna tasdiqlandi.</b>\n\n🎮 O'yinlarni boshlash uchun <b>«🎮 O'yinlar»</b> tugmasini bosing!\n💰 Sizning balansingiz: <b>${user.coins} tanga</b>`,
          replyMarkup: {
            type: 'keyboard',
            keyboardButtons: [
              [{ text: "🎮 O'yinlar" }, { text: "🎁 Kunlik bonus" }],
              [{ text: "💰 Balans & Hamyon" }, { text: "👥 Do'stlarni taklif qilish" }],
              [{ text: "🏆 Reyting" }, { text: "ℹ️ Bot haqida" }]
            ]
          }
        });
      } else {
        const remaining = config.channels.length - getSubscribedCount();
        showToast(`❌ Siz hali ${remaining} ta kanalga a'zo bo'lmadingiz!`);
        addMessage({
          sender: 'bot',
          text: `❌ <b>Obuna tasdiqlanmadi!</b>\n\nSiz hali barcha kanallarga a'zo bo'lmadingiz. Iltimos, barcha kanallarga obuna bo'ling (${getSubscribedCount()}/${config.channels.length}) va qayta tekshiring:`,
          replyMarkup: {
            type: 'inline',
            inlineButtons: [
              ...config.channels.map(c => [
                {
                  text: `${user.isSubscribedChannels[c.id] ? '✅' : '📢'} ${c.name}`,
                  url: c.inviteUrl
                }
              ]),
              [
                {
                  text: '✅ Tasdiqlash / Tekshirish',
                  callbackData: 'verify_subscription'
                }
              ]
            ]
          }
        });
      }
    }, 500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) setInputText('');

    if (text === '/start') {
      sendStartCommand();
      return;
    }

    // Check if subscribed first for all interactive menus
    const isSub = areAllChannelsSubscribed();
    if (!isSub) {
      addMessage({ sender: 'user', text });
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        addMessage({
          sender: 'bot',
          text: `⚠️ <b>Kechirasiz, ${user.firstName}!</b>\n\nBot buyruqlaridan foydalanish uchun avval majburiy kanallarga a'zo bo'lishingiz kerak!`,
          replyMarkup: {
            type: 'inline',
            inlineButtons: [
              ...config.channels.map(c => [{ text: `📢 ${c.name}`, url: c.inviteUrl }]),
              [{ text: '✅ Tasdiqlash / Tekshirish', callbackData: 'verify_subscription' }]
            ]
          }
        });
      }, 400);
      return;
    }

    addMessage({ sender: 'user', text });
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);

      if (text === "🎮 O'yinlar") {
        addMessage({
          sender: 'bot',
          text: `🎮 <b>PlayZone O'yinlar Zali</b>\n\nO'zingizga yoqqan o'yinni tanlang va tangalaringizni ko'paytiring! 🚀\n\n💰 Sizning balansingiz: <b>${user.coins} tanga</b>`,
          replyMarkup: {
            type: 'inline',
            inlineButtons: [
              [{ text: "🎯 Omad g'ildiragi (Wheel)", callbackData: "open_wheel" }],
              [{ text: "🎲 Zar tashlash (Dice)", callbackData: "open_dice" }],
              [{ text: "🪙 Tanga tashlash (Coin)", callbackData: "open_coin" }],
              [{ text: "💣 Minavor o'yini (Mines)", callbackData: "open_mines" }],
              [{ text: "🔢 Son topish (1-6)", callbackData: "open_guess" }]
            ]
          }
        });
      } else if (text === "🎁 Kunlik bonus") {
        const bonus = config.dailyBonus;
        setUser(prev => ({ ...prev, coins: prev.coins + bonus }));
        confetti({ particleCount: 50, spread: 50 });
        addMessage({
          sender: 'bot',
          text: `🎁 <b>Tabriklaymiz!</b>\n\nSizga bugungi kunlik bonus sifatida <b>+${bonus} tanga</b> taqdim etildi!\n💰 Yangi balans: <b>${user.coins + bonus} tanga</b>`
        });
      } else if (text === "💰 Balans & Hamyon") {
        addMessage({
          sender: 'bot',
          text: `💼 <b>Sizning Hamyoningiz:</b>\n\n👤 Foydalanuvchi: <b>${user.firstName}</b> (@${user.username})\n🆔 ID: <code>${user.id}</code>\n💰 Joriy balans: <b>${user.coins} tanga</b>\n👥 Taklif qilingan do'stlar: <b>${user.referralCount} ta</b>\n🎮 O'ynalgan o'yinlar: <b>${user.gamesPlayed} ta</b>`
        });
      } else if (text === "👥 Do'stlarni taklif qilish") {
        const refLink = `https://t.me/${config.botUsername || 'playzone_bot'}?start=${user.id}`;
        addMessage({
          sender: 'bot',
          text: `👥 <b>Do'stlaringizni taklif qiling va tanga ishlang!</b>\n\nHar bir taklif qilingan va kanallarga a'zo bo'lgan do'stingiz uchun <b>+${config.referralBonus} tanga</b> beriladi!\n\n🔗 Sizning referal havolangiz:\n<code>${refLink}</code>`,
          replyMarkup: {
            type: 'inline',
            inlineButtons: [
              [{ text: "📲 Do'stlarga ulashish (Share)", callbackData: "simulate_invite" }]
            ]
          }
        });
      } else if (text === "🏆 Reyting") {
        addMessage({
          sender: 'bot',
          text: `🏆 <b>PlayZone Top O'yinchilari</b>\n\n🥇 1. Jasur Rahimov — 1,850 tanga\n🥈 2. Bekzod Aliyev — 1,420 tanga\n🥉 3. <b>${user.firstName} (Siz)</b> — <b>${user.coins} tanga</b>\n4. Shahzod_99 — 890 tanga\n5. Timur — 750 tanga`
        });
      } else if (text === "ℹ️ Bot haqida") {
        addMessage({
          sender: 'bot',
          text: `ℹ️ <b>${config.botName} haqida:</b>\n\nUshbu bot Telegram kanallariga majburiy obuna bo'lish tizimi bilan integratsiya qilingan mini-o'yinlar platformasidir.\n\n🛠 Dasturlash tili: Python (Aiogram 3 / Telebot) yoki Node.js (Telegraf)`
        });
      } else {
        addMessage({
          sender: 'bot',
          text: `🤖 Buyruq tushunarsiz bo'ldi. Iltimos quyidagi menyu tugmalaridan foydalaning.`
        });
      }
    }, 450);
  };

  const handleInlineAction = (callbackData?: string) => {
    if (!callbackData) return;

    if (callbackData === 'verify_subscription') {
      handleVerifySubscription();
    } else if (callbackData === 'open_wheel') {
      setActiveGame('wheel');
    } else if (callbackData === 'open_dice') {
      setActiveGame('dice');
    } else if (callbackData === 'open_coin') {
      setActiveGame('coin');
    } else if (callbackData === 'open_mines') {
      setActiveGame('mines');
    } else if (callbackData === 'open_guess') {
      setActiveGame('guess');
    } else if (callbackData === 'simulate_invite') {
      setUser(prev => ({
        ...prev,
        referralCount: prev.referralCount + 1,
        coins: prev.coins + config.referralBonus
      }));
      showToast(`🎉 1 ta do'stingiz botga kirdi! +${config.referralBonus} tanga`);
      confetti({ particleCount: 40 });
    }
  };

  const handleUpdateCoins = (delta: number) => {
    setUser(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins + delta),
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: delta > 0 ? prev.gamesWon + 1 : prev.gamesWon
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Telegram Simulator Chat (Mobile frame design) */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
        <div className="w-full max-w-md bg-[#0e1621] rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[720px] relative">
          
          {/* Telegram Header */}
          <div className="bg-[#17212b] border-b border-gray-800 px-4 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md text-sm">
                🎮
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-white font-semibold text-sm leading-tight">{config.botName}</h2>
                  <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.2 rounded font-mono">bot</span>
                </div>
                <p className="text-xs text-gray-400">
                  {isBotTyping ? (
                    <span className="text-cyan-400 animate-pulse">yozmoqda...</span>
                  ) : (
                    "online • PlayZone Games"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-700/60 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.coins}</span>
              </div>

              <button
                onClick={handleReset}
                title="Qayta boshlash (/start)"
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Telegram Toast Alert Overlay */}
          {telegramToast && (
            <div className="absolute top-16 left-4 right-4 z-30 bg-slate-900/95 border border-cyan-500/50 backdrop-blur-md text-white text-xs py-2.5 px-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="leading-snug">{telegramToast}</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#2b5278] text-white rounded-br-none'
                      : 'bg-[#182533] text-gray-100 border border-gray-800/60 rounded-bl-none'
                  }`}
                >
                  <div
                    className="whitespace-pre-line leading-relaxed text-[13px]"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  <div
                    className={`text-[10px] text-right mt-1 ${
                      msg.sender === 'user' ? 'text-blue-200/70' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {/* Inline Buttons */}
                {msg.replyMarkup?.inlineButtons && (
                  <div className="w-[85%] mt-1.5 space-y-1">
                    {msg.replyMarkup.inlineButtons.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-1 gap-1">
                        {row.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => handleInlineAction(btn.callbackData)}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-xl text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                              btn.callbackData === 'verify_subscription'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
                                : btn.url
                                ? 'bg-[#242f3d] hover:bg-[#2e3b4d] text-cyan-300 border border-cyan-500/20'
                                : 'bg-[#242f3d] hover:bg-[#2f3d4f] text-white border border-gray-700/50'
                            }`}
                          >
                            <span>{btn.text}</span>
                            {btn.url && <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isBotTyping && (
              <div className="flex items-center gap-1.5 bg-[#182533] text-gray-400 px-3.5 py-2 rounded-2xl rounded-bl-none w-fit text-xs border border-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* Active Game Modal embedded into the chat */}
            {activeGame && (
              <div className="pt-2 animate-fade-in">
                {activeGame === 'wheel' && (
                  <LuckyWheel
                    currentCoins={user.coins}
                    onUpdateCoins={handleUpdateCoins}
                    onClose={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'dice' && (
                  <DiceRoll
                    currentCoins={user.coins}
                    onUpdateCoins={handleUpdateCoins}
                    onClose={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'coin' && (
                  <CoinFlip
                    currentCoins={user.coins}
                    onUpdateCoins={handleUpdateCoins}
                    onClose={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'mines' && (
                  <MinesweeperGame
                    currentCoins={user.coins}
                    onUpdateCoins={handleUpdateCoins}
                    onClose={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'guess' && (
                  <NumberGuess
                    currentCoins={user.coins}
                    onUpdateCoins={handleUpdateCoins}
                    onClose={() => setActiveGame(null)}
                  />
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Telegram Reply Keyboard Area (Only active if subscribed) */}
          <div className="bg-[#17212b] border-t border-gray-800 p-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSendMessage("🎮 O'yinlar")}
                className="py-2 px-2.5 bg-[#242f3d] hover:bg-[#2e3b4d] active:scale-95 text-white text-xs font-medium rounded-xl border border-gray-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>🎮 O'yinlar</span>
              </button>

              <button
                onClick={() => handleSendMessage("🎁 Kunlik bonus")}
                className="py-2 px-2.5 bg-[#242f3d] hover:bg-[#2e3b4d] active:scale-95 text-white text-xs font-medium rounded-xl border border-gray-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>🎁 Kunlik bonus</span>
              </button>

              <button
                onClick={() => handleSendMessage("💰 Balans & Hamyon")}
                className="py-2 px-2.5 bg-[#242f3d] hover:bg-[#2e3b4d] active:scale-95 text-white text-xs font-medium rounded-xl border border-gray-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>💰 Balans & Hamyon</span>
              </button>

              <button
                onClick={() => handleSendMessage("👥 Do'stlarni taklif qilish")}
                className="py-2 px-2.5 bg-[#242f3d] hover:bg-[#2e3b4d] active:scale-95 text-white text-xs font-medium rounded-xl border border-gray-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>👥 Referal tizimi</span>
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Xabar yozing yoki /start..."
                className="flex-1 bg-[#242f3d] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Subscription Controller & Status Panel */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
        
        {/* Status card */}
        <div className="bg-[#17212b] border border-gray-800 rounded-2xl p-4 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-sm">Majburiy Obuna Holati</h3>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                areAllChannelsSubscribed()
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              {areAllChannelsSubscribed() ? 'Barchasiga a\'zo' : `${getSubscribedCount()}/${config.channels.length} ta`}
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Quyidagi kanallarga bosib obuna holatini o'zgartiring va bot qanday javob qaytarishini sinab ko'ring:
          </p>

          <div className="space-y-2">
            {config.channels.map((ch) => {
              const isSub = !!user.isSubscribedChannels[ch.id];
              return (
                <div
                  key={ch.id}
                  onClick={() => toggleChannelSubscription(ch.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSub
                      ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/60'
                      : 'bg-gray-900/60 border-gray-700/80 hover:border-gray-600'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-gray-100">{ch.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{ch.username}</span>
                    </div>
                    {ch.description && (
                      <p className="text-[11px] text-gray-400">{ch.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isSub ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> A'zo
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-400" /> A'zo emas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
            <button
              onClick={subscribeToAllChannels}
              className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Barchasiga a'zo bo'lish
            </button>
            <button
              onClick={unsubscribeFromAll}
              className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Obunani bekor qilish
            </button>
          </div>
        </div>

        {/* How it works info card */}
        <div className="bg-[#17212b] border border-cyan-500/20 rounded-2xl p-4 text-white shadow-xl space-y-2.5 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Smartphone className="w-4 h-4" />
            <span>Telegram Bot Ishlash Mantig'i</span>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed">
            <li>
              Foydalanuvchi <code>/start</code> bosganda bot Telegram API orqali <code>getChatMember(channel_id, user_id)</code> ni chaqiradi.
            </li>
            <li>
              Agar foydalanuvchi statusi <code>member</code>, <code>administrator</code> yoki <code>creator</code> bo'lsa — bot ochiladi.
            </li>
            <li>
              Agar <code>left</code> yoki <code>kicked</code> bo'lsa — bot o'yinlarni yopadi va inline tugmalar bilan kanallarga yo'naltiradi.
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
};
