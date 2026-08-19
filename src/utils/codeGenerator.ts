import { BotConfig } from '../types';

export function generateAiogram3Code(config: BotConfig): string {
  const channelListFormatted = config.channels
    .map(c => `    "${c.username.startsWith('@') || c.username.startsWith('-100') ? c.username : '@' + c.username}"`)
    .join(',\n');

  const channelButtonsCode = config.channels
    .map((c, i) => `    builder.button(text="📢 ${c.name.replace(/"/g, '\\"')}", url="${c.inviteUrl || `https://t.me/${c.username.replace('@', '')}`}")`)
    .join('\n');

  return `# =========================================================
#  PlayZoneBot - Telegram Majburiy Obuna & O'yinlar Boti
#  Kutubxona: aiogram 3.x (Asinxron va juda tez)
#  Python versiyasi: 3.10+
# =========================================================

import asyncio
import logging
import random
from typing import List
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    KeyboardButton,
    CallbackQuery,
    Message
)
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from aiogram.enums import ChatMemberStatus

# --- SOZLAMALAR (CONFIG) ---
BOT_TOKEN = "${config.botToken || 'YOUR_TELEGRAM_BOT_TOKEN_HERE'}"
ADMINS = [${config.adminId || '123456789'}]

# Majburiy a'zo bo'linishi kerak bo'lgan kanallar ro'yxati
# DIQQAT: Bot ushbu kanallarda ADMIN bo'lishi shart!
CHANNELS: List[str] = [
${channelListFormatted}
]

# Foydalanuvchilar ma'lumotlar bazasi (oddiy xotirada, SQLite yoki PostgreSQL ulashingiz mumkin)
user_balances = {}  # {user_id: coins}
user_referrals = {} # {user_id: invited_count}

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# --- YORDAMCHI FUNKSIYALAR: OBUNANI TEKSHIRISH ---
async def check_user_subscription(bot: Bot, user_id: int, channel: str) -> bool:
    """Foydalanuvchi ko'rsatilgan kanalda bor yoki yo'qligini tekshiradi"""
    try:
        member = await bot.get_chat_member(chat_id=channel, user_id=user_id)
        # Obuna hisoblangan statuslar
        allowed_statuses = [
            ChatMemberStatus.MEMBER,
            ChatMemberStatus.ADMINISTRATOR,
            ChatMemberStatus.CREATOR
        ]
        return member.status in allowed_statuses
    except Exception as e:
        logging.error(f"Kanalni tekshirishda xatolik ({channel}): {e}")
        # Agar bot kanalda admin bo'lmasa yoki kanal topilmasa
        return False

async def check_all_channels(bot: Bot, user_id: int) -> bool:
    """Barcha majburiy kanallarga a'zo bo'lganligini tekshiradi"""
    for channel in CHANNELS:
        is_sub = await check_user_subscription(bot, user_id, channel)
        if not is_sub:
            return False
    return True

# --- TUGMALAR (KEYBOARDS) ---
def get_subscription_inline_keyboard() -> InlineKeyboardMarkup:
    """Majburiy kanallar ro'yxati va Tasdiqlash tugmasi"""
    builder = InlineKeyboardBuilder()
${channelButtonsCode}
    
    # 2-qator: Tekshirish (Tasdiqlash) tugmasi
    builder.button(text="✅ Tasdiqlash / Tekshirish", callback_data="check_subscription")
    builder.adjust(1) # Har bir tugma alohida qatorda
    return builder.as_markup()

def get_main_menu_keyboard() -> ReplyKeyboardMarkup:
    """O'yinlar va asosiy menyu tugmalari"""
    builder = ReplyKeyboardBuilder()
    builder.button(text="🎮 O'yinlar")
    builder.button(text="🎁 Kunlik bonus")
    builder.button(text="💰 Balans & Hamyon")
    builder.button(text="👥 Do'stlarni taklif qilish")
    builder.button(text="🏆 Reyting")
    builder.button(text="ℹ️ Bot haqida")
    builder.adjust(2, 2, 2)
    return builder.as_markup(resize_keyboard=True)

def get_games_inline_keyboard() -> InlineKeyboardMarkup:
    """O'yin turlari menyusi"""
    builder = InlineKeyboardBuilder()
    builder.button(text="🎯 Omad g'ildiragi (Wheel)", callback_data="game_wheel")
    builder.button(text="🎲 Zar tashlash (Dice)", callback_data="game_dice")
    builder.button(text="🪙 Tanga tashlash (Coin)", callback_data="game_coin")
    builder.button(text="💣 Minavor o'yini (Mines)", callback_data="game_mines")
    builder.button(text="🔢 Son topish (1-10)", callback_data="game_guess")
    builder.adjust(1)
    return builder.as_markup()

# --- BOT BUYRUQLARI VA HANDLERLAR ---

@dp.message(CommandStart())
async def start_handler(message: Message):
    user_id = message.from_user.id
    user_name = message.from_user.full_name

    # Boshlang'ich hisob
    if user_id not in user_balances:
        user_balances[user_id] = ${config.initialCoins}
        user_referrals[user_id] = 0

    # 1-QADAM: Obunani tekshiramiz
    is_subscribed = await check_all_channels(bot, user_id)

    if not is_subscribed:
        # Obuna bo'lmagan: Bot ishga tushmaydi va kanallarga a'zo bo'lishni talab qiladi
        text = (
            f"Salom, {user_name}! 👋\\n\\n"
            f"⚠️ <b>PlayZone o'yinlar botidan foydalanish uchun</b> quyidagi rasmiy "
            f"kanallarimizga a'zo bo'lishingiz shart!\\n\\n"
            f"Barcha kanallarga obuna bo'lgach, pastdagi <b>«✅ Tasdiqlash / Tekshirish»</b> tugmasini bosing:"
        )
        await message.answer(
            text,
            parse_mode="HTML",
            reply_markup=get_subscription_inline_keyboard()
        )
        return

    # Obuna tasdiqlangan bo'lsa: Asosiy menyu ochiladi
    welcome_text = (
        f"🎉 <b>Xush kelibsiz, {user_name}!</b>\\n\\n"
        f"🕹️ <b>PlayZone Bot</b>ga muvaffaqiyatli kirdingiz.\\n"
        f"💰 Sizning hisobingiz: <b>{user_balances[user_id]} tanga</b>\\n\\n"
        f"Quyidagi menyudan kerakli bo'limni tanlang 👇"
    )
    await message.answer(
        welcome_text,
        parse_mode="HTML",
        reply_markup=get_main_menu_keyboard()
    )

@dp.callback_query(F.data == "check_subscription")
async def verify_subscription_callback(call: CallbackQuery):
    user_id = call.from_user.id
    user_name = call.from_user.full_name

    is_subscribed = await check_all_channels(bot, user_id)

    if is_subscribed:
        # Obuna bo'lgan: Xabarni yangilaymiz va asosiy menyuni yuboramiz
        await call.answer("✅ Tabriklaymiz! Obuna tasdiqlandi!", show_alert=True)
        try:
            await call.message.delete()
        except Exception:
            pass

        welcome_text = (
            f"🎉 <b>Ajoyib, {user_name}! Obuna tasdiqlandi.</b>\\n\\n"
            f"🎮 O'yinlarni boshlash uchun <b>«🎮 O'yinlar»</b> tugmasini bosing!\\n"
            f"💰 Sizning balansingiz: <b>{user_balances.get(user_id, ${config.initialCoins})} tanga</b>"
        )
        await call.message.answer(
            welcome_text,
            parse_mode="HTML",
            reply_markup=get_main_menu_keyboard()
        )
    else:
        # Hali hamma kanallarga a'zo bo'lmagan
        await call.answer(
            "❌ Siz hali barcha kanallarga a'zo bo'lmadingiz! Iltimos, barcha kanallarga kiring va qayta tekshiring.",
            show_alert=True
        )

# --- O'YINLAR VA BO'LIMLAR HANDLERLARI ---

@dp.message(F.text == "🎮 O'yinlar")
async def show_games(message: Message):
    user_id = message.from_user.id
    if not await check_all_channels(bot, user_id):
        await message.answer("⚠️ Avval kanallarga a'zo bo'ling:", reply_markup=get_subscription_inline_keyboard())
        return

    text = (
        "🎮 <b>PlayZone O'yinlar Zali</b>\\n\\n"
        "O'zingizga yoqqan o'yinni tanlang va tangalaringizni ko'paytiring! 🚀"
    )
    await message.answer(text, parse_mode="HTML", reply_markup=get_games_inline_keyboard())

@dp.callback_query(F.data == "game_dice")
async def play_dice(call: CallbackQuery):
    user_id = call.from_user.id
    balance = user_balances.get(user_id, ${config.initialCoins})
    bet = 10

    if balance < bet:
        await call.answer(f"❌ Balansingizda yetarli tanga yo'q! (Kerak: {bet} tanga)", show_alert=True)
        return

    # Bot va Foydalanuvchi zarlari
    user_dice = random.randint(1, 6)
    bot_dice = random.randint(1, 6)

    if user_dice > bot_dice:
        win = bet * 2
        user_balances[user_id] = balance + bet
        msg = f"🎲 <b>G'alaba!</b>\\n\\nSizning zaringiz: <b>{user_dice}</b> 🎲\\nBotning zari: <b>{bot_dice}</b> 🤖\\n\\n🏆 +{win} tanga yutdingiz! Yangi balans: <b>{user_balances[user_id]} tanga</b>"
    elif user_dice < bot_dice:
        user_balances[user_id] = balance - bet
        msg = f"🎲 <b>Mag'lubiyat!</b>\\n\\nSizning zaringiz: <b>{user_dice}</b> 🎲\\nBotning zari: <b>{bot_dice}</b> 🤖\\n\\n😢 -{bet} tanga yutqazdingiz. Yangi balans: <b>{user_balances[user_id]} tanga</b>"
    else:
        msg = f"🎲 <b>Durang!</b>\\n\\nSiz: <b>{user_dice}</b> | Bot: <b>{bot_dice}</b>\\nTangalaringiz o'z joyida qoldi."

    await call.message.answer(msg, parse_mode="HTML")
    await call.answer()

@dp.callback_query(F.data == "game_coin")
async def play_coin(call: CallbackQuery):
    user_id = call.from_user.id
    balance = user_balances.get(user_id, ${config.initialCoins})
    bet = 10

    if balance < bet:
        await call.answer(f"❌ Balansda tanga yetarli emas! ({bet} tanga kerak)", show_alert=True)
        return

    result = random.choice(["burgut", "raqam"])
    if result == "burgut":
        user_balances[user_id] = balance + bet
        msg = f"🪙 Tanga tashlandi: <b>BURGUT 🦅</b>!\\n\\n🎉 Siz yutdingiz! Yangi balans: <b>{user_balances[user_id]} tanga</b>"
    else:
        user_balances[user_id] = balance - bet
        msg = f"🪙 Tanga tashlandi: <b>RAQAM 🔢</b>!\\n\\n😢 Afsus, omad kelmadi. Yangi balans: <b>{user_balances[user_id]} tanga</b>"

    await call.message.answer(msg, parse_mode="HTML")
    await call.answer()

@dp.message(F.text == "💰 Balans & Hamyon")
async def show_balance(message: Message):
    user_id = message.from_user.id
    balance = user_balances.get(user_id, ${config.initialCoins})
    invited = user_referrals.get(user_id, 0)
    
    text = (
        f"💼 <b>Sizning Hamyoningiz:</b>\\n\\n"
        f"👤 ID: <code>{user_id}</code>\\n"
        f"💰 Balans: <b>{balance} tanga</b>\\n"
        f"👥 Taklif qilingan do'stlar: <b>{invited} ta</b>\\n"
    )
    await message.answer(text, parse_mode="HTML")

@dp.message(F.text == "🎁 Kunlik bonus")
async def get_daily_bonus(message: Message):
    user_id = message.from_user.id
    bonus = ${config.dailyBonus}
    user_balances[user_id] = user_balances.get(user_id, ${config.initialCoins}) + bonus
    
    await message.answer(
        f"🎁 <b>Tabriklaymiz!</b>\\n\\nSizga bugungi kunlik bonus sifatida <b>+{bonus} tanga</b> berildi!\\n"
        f"💰 Joriy balansingiz: <b>{user_balances[user_id]} tanga</b>",
        parse_mode="HTML"
    )

@dp.message(F.text == "👥 Do'stlarni taklif qilish")
async def referral_link(message: Message):
    user_id = message.from_user.id
    bot_info = await bot.get_me()
    ref_link = f"https://t.me/{bot_info.username}?start={user_id}"
    
    text = (
        f"👥 <b>Do'stlarni taklif qiling va tanga ishlang!</b>\\n\\n"
        f"Har bir taklif qilingan do'stingiz uchun <b>+${config.referralBonus} tanga</b> olasiz.\\n\\n"
        f"🔗 Sizning taklif havolangiz:\\n<code>{ref_link}</code>"
    )
    await message.answer(text, parse_mode="HTML")

# --- BOTNI ISHGA TUSHIRISH ---
async def main():
    print("🚀 PlayZoneBot muvaffaqiyatli ishga tushdi...")
    # Eski yangilanishlarni o'chirib tashlash
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Bot to'xtatildi!")
`;
}

export function generateTelebotCode(config: BotConfig): string {
  const channelsPy = config.channels.map(c => `    "${c.username}"`).join(',\n');
  const buttonsPy = config.channels
    .map(c => `    markup.add(types.InlineKeyboardButton("📢 ${c.name.replace(/"/g, '\\"')}", url="${c.inviteUrl || `https://t.me/${c.username.replace('@', '')}`}"))`)
    .join('\n');

  return `# =========================================================
#  PlayZoneBot - pyTelegramBotAPI (telebot) orqali
#  O'rnatish: pip install pyTelegramBotAPI
# =========================================================

import telebot
from telebot import types
import random

BOT_TOKEN = "${config.botToken || 'YOUR_BOT_TOKEN_HERE'}"
bot = telebot.TeleBot(BOT_TOKEN)

# Majburiy kanallar ro'yxati
CHANNELS = [
${channelsPy}
]

# Balanslar
balances = {}

def is_user_subscribed(user_id, channel):
    """Foydalanuvchi kanalda borligini tekshiradi"""
    try:
        status = bot.get_chat_member(channel, user_id).status
        return status in ['member', 'administrator', 'creator']
    except Exception as e:
        print(f"Xatolik: {e}")
        return False

def check_all_subscriptions(user_id):
    """Barcha kanallarni tekshiradi"""
    for ch in CHANNELS:
        if not is_user_subscribed(user_id, ch):
            return False
    return True

def get_sub_markup():
    markup = types.InlineKeyboardMarkup(row_width=1)
${buttonsPy}
    markup.add(types.InlineKeyboardButton("✅ Obunani tekshirish", callback_data="verify_sub"))
    return markup

def get_main_menu():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    markup.add("🎮 O'yinlar", "🎁 Kunlik bonus", "💰 Balans", "👥 Referal")
    return markup

@bot.message_handler(commands=['start'])
def handle_start(message):
    user_id = message.from_user.id
    if user_id not in balances:
        balances[user_id] = ${config.initialCoins}

    if not check_all_subscriptions(user_id):
        bot.send_message(
            message.chat.id,
            "⚠️ <b>Botdan foydalanish uchun quyidagi kanallarga a'zo bo'ling:</b>",
            parse_mode="HTML",
            reply_markup=get_sub_markup()
        )
        return

    bot.send_message(
        message.chat.id,
        f"🎉 <b>Xush kelibsiz, {message.from_user.first_name}!</b>\\nPlayZone o'yinlariga marhamat!",
        parse_mode="HTML",
        reply_markup=get_main_menu()
    )

@bot.callback_query_handler(func=lambda call: call.data == "verify_sub")
def handle_verify(call):
    user_id = call.from_user.id
    if check_all_subscriptions(user_id):
        bot.answer_callback_query(call.id, "✅ Obunangiz tasdiqlandi!")
        try:
            bot.delete_message(call.message.chat.id, call.message.message_id)
        except:
            pass
        bot.send_message(
            call.message.chat.id,
            "🎉 <b>Tabriklaymiz! Barcha kanallarga a'zo bo'ldingiz.</b>",
            parse_mode="HTML",
            reply_markup=get_main_menu()
        )
    else:
        bot.answer_callback_query(call.id, "❌ Hali hamma kanallarga a'zo bo'lmadingiz!", show_alert=True)

@bot.message_handler(func=lambda m: m.text == "🎮 O'yinlar")
def play_game(message):
    if not check_all_subscriptions(message.from_user.id):
        bot.send_message(message.chat.id, "⚠️ Avval obuna bo'ling:", reply_markup=get_sub_markup())
        return
    
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("🎲 Zar tashlash", callback_data="dice"))
    bot.send_message(message.chat.id, "O'yinni tanlang:", reply_markup=markup)

@bot.callback_query_handler(func=lambda c: c.data == "dice")
def dice_game(call):
    user_id = call.from_user.id
    score = random.randint(1, 6)
    if score >= 4:
        balances[user_id] += 20
        bot.send_message(call.message.chat.id, f"🎲 Natija: {score} - G'alaba! +20 tanga")
    else:
        balances[user_id] -= 10
        bot.send_message(call.message.chat.id, f"🎲 Natija: {score} - Mag'lubiyat! -10 tanga")

print("PlayZone Telebot ishga tushdi...")
bot.infinity_polling()
`;
}

export function generateNodeJsCode(config: BotConfig): string {
  const channelListJson = JSON.stringify(
    config.channels.map(c => c.username),
    null,
    2
  );

  return `/**
 * PlayZoneBot - Telegram Majburiy Obuna & O'yinlar Boti
 * Kutubxona: Telegraf.js v4 (Node.js)
 * O'rnatish: npm install telegraf dotenv
 */

const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || '${config.botToken || 'YOUR_BOT_TOKEN'}';
const bot = new Telegraf(BOT_TOKEN);

// Majburiy kanallar ro'yxati (Bot ushbu kanallarda ADMIN bo'lishi shart!)
const CHANNELS = ${channelListJson};

// Foydalanuvchilar ma'lumotlari
const userBalances = new Map();

/**
 * Obunani tekshirish funksiyasi
 */
async function checkSubscription(ctx, channelUsername) {
  try {
    const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);
    const validStatuses = ['creator', 'administrator', 'member'];
    return validStatuses.includes(member.status);
  } catch (error) {
    console.error(\`Kanal tekshirishda xatolik (\${channelUsername}):\`, error.message);
    return false;
  }
}

/**
 * Barcha kanallarni tekshirish
 */
async function checkAllChannels(ctx) {
  for (const channel of CHANNELS) {
    const isSub = await checkSubscription(ctx, channel);
    if (!isSub) return false;
  }
  return true;
}

// Obuna bo'lish tugmalari
function getSubscriptionKeyboard() {
  const buttons = [
${config.channels
  .map(
    c =>
      `    [Markup.button.url('📢 ${c.name}', '${c.inviteUrl || `https://t.me/${c.username.replace('@', '')}`}')]`
  )
  .join(',\n')},
    [Markup.button.callback('✅ Obunani tekshirish', 'check_sub')]
  ];
  return Markup.inlineKeyboard(buttons);
}

// Asosiy menyu
function getMainMenu() {
  return Markup.keyboard([
    ["🎮 O'yinlar", "🎁 Kunlik bonus"],
    ["💰 Balans", "👥 Do'stlarni taklif qilish"]
  ]).resize();
}

// /start buyrug'i
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  if (!userBalances.has(userId)) {
    userBalances.set(userId, ${config.initialCoins});
  }

  const isSubscribed = await checkAllChannels(ctx);

  if (!isSubscribed) {
    return ctx.reply(
      \`Assalomu alaykum, \${ctx.from.first_name}! 👋\\n\\n\` +
      \`⚠️ PlayZone botimizdan to'liq foydalanish va o'yinlarni boshlash uchun quyidagi rasmiy kanallarimizga a'zo bo'ling:\\n\\n\` +
      \`A'zo bo'lgach «✅ Obunani tekshirish» tugmasini bosing.\`,
      getSubscriptionKeyboard()
    );
  }

  return ctx.reply(
    \`🎉 Xush kelibsiz, \${ctx.from.first_name}!\\nPlayZone o'yinlar zali xizmatingizda.\\n\\n💰 Balansingiz: \${userBalances.get(userId)} tanga\`,
    getMainMenu()
  );
});

// Callback: Obunani tekshirish
bot.action('check_sub', async (ctx) => {
  const isSubscribed = await checkAllChannels(ctx);

  if (isSubscribed) {
    await ctx.answerCbQuery('✅ Obuna tasdiqlandi!');
    try {
      await ctx.deleteMessage();
    } catch (e) {}
    
    return ctx.reply(
      \`🎉 Tabriklaymiz! Barcha kanallarga muvaffaqiyatli a'zo bo'ldingiz.\\n\\nQuyidagi menyudan o'yinni tanlang:\`,
      getMainMenu()
    );
  } else {
    return ctx.answerCbQuery('❌ Siz hali barcha kanallarga a\\'zo bo\\'lmadingiz! Iltimos obuna bo\\'lib qayta urinib ko\\'ring.', { show_alert: true });
  }
});

// O'yinlar bo'limi
bot.hears("🎮 O'yinlar", async (ctx) => {
  const isSubscribed = await checkAllChannels(ctx);
  if (!isSubscribed) {
    return ctx.reply('⚠️ Avval kanallarga obuna bo\\'ling:', getSubscriptionKeyboard());
  }

  return ctx.reply(
    '🎲 Qaysi o\\'yinni o\\'ynaymiz?',
    Markup.inlineKeyboard([
      [Markup.button.callback('🎲 Zar tashlash', 'game_dice')],
      [Markup.button.callback('🪙 Tanga tashlash', 'game_coin')]
    ])
  );
});

bot.action('game_dice', async (ctx) => {
  const userId = ctx.from.id;
  const current = userBalances.get(userId) || ${config.initialCoins};
  const roll = Math.floor(Math.random() * 6) + 1;
  
  if (roll >= 4) {
    userBalances.set(userId, current + 20);
    await ctx.reply(\`🎲 Sizning natijangiz: \${roll} - G'ALABA! (+20 tanga)\\nYangi balans: \${userBalances.get(userId)}\`);
  } else {
    userBalances.set(userId, current - 10);
    await ctx.reply(\`🎲 Sizning natijangiz: \${roll} - Mag'lubiyat (-10 tanga)\\nYangi balans: \${userBalances.get(userId)}\`);
  }
  await ctx.answerCbQuery();
});

bot.launch().then(() => {
  console.log('PlayZone Telegram Bot (Node.js) ishga tushdi! 🚀');
});

// Xatoliklarni ushlash
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
`;
}

export function generateRequirementsTxt(): string {
  return `aiogram==3.15.0
aiohttp==3.10.5
pydantic==2.8.2
python-dotenv==1.0.1
`;
}

export function generateEnvFile(config: BotConfig): string {
  return `# PlayZoneBot Environment Variables
BOT_TOKEN="${config.botToken || '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'}"
ADMIN_ID="${config.adminId || '123456789'}"
INITIAL_COINS="${config.initialCoins}"
DAILY_BONUS="${config.dailyBonus}"
REFERRAL_BONUS="${config.referralBonus}"
`;
}

export function generateDatabasePy(): string {
  return `import sqlite3
import datetime

class Database:
    def __init__(self, db_file="playzone.db"):
        self.connection = sqlite3.connect(db_file)
        self.cursor = self.connection.cursor()
        self.create_tables()

    def create_tables(self):
        with self.connection:
            self.cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY,
                    username TEXT,
                    full_name TEXT,
                    balance INTEGER DEFAULT 100,
                    referrer_id INTEGER,
                    referral_count INTEGER DEFAULT 0,
                    last_daily_bonus TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            self.cursor.execute("""
                CREATE TABLE IF NOT EXISTS game_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    game_type TEXT,
                    bet_amount INTEGER,
                    win_amount INTEGER,
                    result TEXT,
                    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def get_or_create_user(self, user_id: int, username: str, full_name: str, referrer_id: int = None, initial_coins: int = 100):
        with self.connection:
            self.cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            user = self.cursor.fetchone()
            if not user:
                self.cursor.execute(
                    "INSERT INTO users (user_id, username, full_name, balance, referrer_id) VALUES (?, ?, ?, ?, ?)",
                    (user_id, username, full_name, initial_coins, referrer_id)
                )
                if referrer_id:
                    self.cursor.execute(
                        "UPDATE users SET referral_count = referral_count + 1, balance = balance + 50 WHERE user_id = ?",
                        (referrer_id,)
                    )
                return self.get_user(user_id)
            return user

    def get_user(self, user_id: int):
        self.cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        return self.cursor.fetchone()

    def update_balance(self, user_id: int, amount: int):
        with self.connection:
            self.cursor.execute("UPDATE users SET balance = balance + ? WHERE user_id = ?", (amount, user_id))

    def get_top_users(self, limit: int = 10):
        self.cursor.execute("SELECT full_name, balance FROM users ORDER BY balance DESC LIMIT ?", (limit,))
        return self.cursor.fetchall()
`;
}
