export interface ChannelConfig {
  id: string;
  name: string;
  username: string; // e.g. "@playzone_uz" or "-100123456789"
  inviteUrl: string; // e.g. "https://t.me/playzone_uz"
  isRequired: boolean;
  icon?: string;
  memberCount?: string;
  description?: string;
}

export interface BotConfig {
  botName: string;
  botUsername: string;
  botToken: string;
  adminId: string;
  channels: ChannelConfig[];
  initialCoins: number;
  referralBonus: number;
  dailyBonus: number;
  welcomeMessage: string;
  forceSubscribeText: string;
  subscriptionSuccessText: string;
}

export interface TelegramUser {
  id: number;
  firstName: string;
  username: string;
  coins: number;
  isSubscribedChannels: Record<string, boolean>; // channelId -> isSubscribed
  referralCount: number;
  gamesPlayed: number;
  gamesWon: number;
  lastDailyBonus?: string;
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  replyMarkup?: {
    type: 'inline' | 'keyboard' | 'none';
    inlineButtons?: Array<Array<{ text: string; callbackData?: string; url?: string }>>;
    keyboardButtons?: Array<Array<{ text: string }>>;
  };
  gameData?: {
    gameType: 'wheel' | 'dice' | 'coin' | 'mines' | 'guess';
    status?: string;
  };
}

export type ActiveTab = 'simulator' | 'code' | 'config' | 'guide' | 'ai_assistant';
