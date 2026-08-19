import React, { useState } from 'react';
import { BotConfig, ChannelConfig } from '../types';
import {
  Settings,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Layers,
  KeyRound,
  User,
  Coins,
  CheckCircle,
  Link as LinkIcon
} from 'lucide-react';

interface BotConfiguratorProps {
  config: BotConfig;
  onChangeConfig: (newConfig: BotConfig) => void;
}

export const BotConfigurator: React.FC<BotConfiguratorProps> = ({
  config,
  onChangeConfig
}) => {
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUsername, setNewChannelUsername] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newChannelUsername.trim()) return;

    let usernameFormatted = newChannelUsername.trim();
    if (!usernameFormatted.startsWith('@') && !usernameFormatted.startsWith('-100')) {
      usernameFormatted = '@' + usernameFormatted;
    }

    const inviteUrlFormatted = newChannelUrl.trim() || (
      usernameFormatted.startsWith('@')
        ? `https://t.me/${usernameFormatted.replace('@', '')}`
        : 'https://t.me/'
    );

    const newChannel: ChannelConfig = {
      id: 'ch-' + Date.now(),
      name: newChannelName.trim(),
      username: usernameFormatted,
      inviteUrl: inviteUrlFormatted,
      isRequired: true,
      description: 'Yangi qo\'shilgan majburiy kanal'
    };

    onChangeConfig({
      ...config,
      channels: [...config.channels, newChannel]
    });

    setNewChannelName('');
    setNewChannelUsername('');
    setNewChannelUrl('');
    triggerSaved();
  };

  const handleRemoveChannel = (channelId: string) => {
    if (config.channels.length <= 1) {
      alert("⚠️ Kamida bitta kanal bo'lishi kerak!");
      return;
    }
    onChangeConfig({
      ...config,
      channels: config.channels.filter(c => c.id !== channelId)
    });
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Bot credentials & basic info */}
      <div className="bg-[#17212b] border border-gray-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-base">Botning Asosiy Sozlamalari</h2>
          </div>
          {savedToast && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5" /> Saqlandi!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Bot nomi:
            </label>
            <input
              type="text"
              value={config.botName}
              onChange={(e) => {
                onChangeConfig({ ...config, botName: e.target.value });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:border-cyan-500"
              placeholder="Masalan: PlayZoneBot"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              Bot Username:
            </label>
            <input
              type="text"
              value={config.botUsername}
              onChange={(e) => {
                onChangeConfig({ ...config, botUsername: e.target.value });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:border-cyan-500"
              placeholder="@playzone_uz_bot"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Telegram Bot API Token (@BotFather dan olingan):
            </label>
            <input
              type="text"
              value={config.botToken}
              onChange={(e) => {
                onChangeConfig({ ...config, botToken: e.target.value });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:border-cyan-500 font-mono text-cyan-300"
              placeholder="1234567890:AAHj3_..."
            />
            <p className="text-[11px] text-gray-400">
              Bu token generatsiya qilinadigan Python va Node.js kodlariga avtomatik qo'yiladi.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Channels Management */}
      <div className="bg-[#17212b] border border-gray-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-base">Majburiy Obuna Kanallari Ro'yxati</h2>
          </div>
          <span className="text-xs text-gray-400">
            Jami: <strong className="text-cyan-400">{config.channels.length} ta kanal</strong>
          </span>
        </div>

        {/* Existing channels list */}
        <div className="space-y-2.5">
          {config.channels.map((channel, index) => (
            <div
              key={channel.id}
              className="bg-[#0e1621] border border-gray-700/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-800 text-cyan-400 text-xs px-2 py-0.5 rounded font-mono font-bold">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-sm text-gray-100">{channel.name}</span>
                  <span className="text-xs text-cyan-300 font-mono">{channel.username}</span>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-2">
                  <span>Havola: <a href={channel.inviteUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{channel.inviteUrl}</a></span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveChannel(channel.id)}
                title="Kanalni o'chirish"
                className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new channel form */}
        <form onSubmit={handleAddChannel} className="bg-[#111923] border border-cyan-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
            <Plus className="w-4 h-4" />
            <span>Yangi Majburiy Kanal Qo'shish</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-gray-300 block mb-1">Kanal Nomi:</label>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Masalan: Tezkor Yangiliklar"
                className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-300 block mb-1">Username yoki Kanal ID:</label>
              <input
                type="text"
                value={newChannelUsername}
                onChange={(e) => setNewChannelUsername(e.target.value)}
                placeholder="@kanal_username yoki -100..."
                className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-300 block mb-1">Taklif Havolasi (Invite URL):</label>
              <input
                type="text"
                value={newChannelUrl}
                onChange={(e) => setNewChannelUrl(e.target.value)}
                placeholder="https://t.me/kanal_nomi"
                className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            Kanalni Ro'yxatga Qo'shish
          </button>
        </form>
      </div>

      {/* Gamification Coins & Rewards Settings */}
      <div className="bg-[#17212b] border border-gray-800 rounded-2xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Coins className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold text-base">O'yin Mukofotlari va Bonuslar</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-300">Boshlang'ich tanga (Start bonus):</label>
            <input
              type="number"
              value={config.initialCoins}
              onChange={(e) => {
                onChangeConfig({ ...config, initialCoins: Number(e.target.value) || 0 });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300">Kunlik bonus miqdori:</label>
            <input
              type="number"
              value={config.dailyBonus}
              onChange={(e) => {
                onChangeConfig({ ...config, dailyBonus: Number(e.target.value) || 0 });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300">Referal taklif bonusi (Har bir do'st):</label>
            <input
              type="number"
              value={config.referralBonus}
              onChange={(e) => {
                onChangeConfig({ ...config, referralBonus: Number(e.target.value) || 0 });
                triggerSaved();
              }}
              className="w-full bg-[#0e1621] text-white text-xs rounded-xl px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
