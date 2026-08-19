import { BotConfig } from '../types';

export const initialBotConfig: BotConfig = {
  botName: "PlayZoneBot",
  botUsername: "playzone_game_bot",
  botToken: "7189402948:AAHj3_SampleTelegramTokenPlayZone991",
  adminId: "987654321",
  initialCoins: 100,
  referralBonus: 50,
  dailyBonus: 25,
  welcomeMessage: "🎉 Xush kelibsiz! PlayZone o'yinlar botida qiziqarli mini-o'yinlar o'ynab, ballar va sovg'alarga ega bo'ling.",
  forceSubscribeText: "⚠️ Botdan to'liq foydalanish va o'yinlarni boshlash uchun quyidagi rasmiy kanallarimizga a'zo bo'ling:",
  subscriptionSuccessText: "🎉 Tabriklaymiz! Barcha kanallarga muvaffaqiyatli a'zo bo'ldingiz. O'yinlarni boshlashingiz mumkin!",
  channels: [
    {
      id: "ch-1",
      name: "PlayZone Official",
      username: "@playzone_official",
      inviteUrl: "https://t.me/playzone_official",
      isRequired: true,
      memberCount: "42.5K",
      description: "Rasmiy yangiliklar va yangi turnirlar kanali"
    },
    {
      id: "ch-2",
      name: "Gaming News UZ",
      username: "@gaming_news_uz",
      inviteUrl: "https://t.me/gaming_news_uz",
      isRequired: true,
      memberCount: "28.1K",
      description: "O'yinlar va bonuslar taqdimoti kanali"
    },
    {
      id: "ch-3",
      name: "PlayZone Sponsorlik Kanali",
      username: "@playzone_sponsors",
      inviteUrl: "https://t.me/playzone_sponsors",
      isRequired: true,
      memberCount: "19.8K",
      description: "Homiylarimizning maxsus sovg'ali kanali"
    }
  ]
};

export const guideSteps = [
  {
    step: 1,
    title: "Telegramda @BotFather orqali yangi bot ochish",
    description: "Telegram qidiruvidan @BotFather ni toping va /newbot buyrug'ini yuboring. Botingiz nomini va @username'sini tanlang. Natijada sizga API Token beriladi.",
    codeExample: "/newbot\nName: PlayZone Games\nUsername: playzone_games_bot\n\nToken: 7189402948:AAHj3_SampleTelegramTokenPlayZone991",
    tip: "Tokeningizni hech kimga ko'rsatmang va xavfsiz saqlang."
  },
  {
    step: 2,
    title: "Kanallarni yaratish va Botni ADMIN qilish (O'TA MUHIM)",
    description: "Bot kanaldagi odamlarni tekshirishi (`get_chat_member`) uchun BOT KANALDA ADMIN (Administrator) bo'lishi shart! Agar bot admin qilinmasa, Telegram API `ChatAdminRequired` yoki `User not found` xatoligini beradi.",
    codeExample: "1. Telegram kanalingizga kiring\n2. 'Administrators' bo'limiga o'ting\n3. 'Add Administrator' -> Botingiz username'sini kiriting (@playzone_games_bot)\n4. Saqlang (Hech bo'lmasa oddiy admin ruxsati kifoya)",
    tip: "Bot admin qilinmagan kanallarda obunani tekshirish ishlamaydi."
  },
  {
    step: 3,
    title: "Kanal username yoki ID raqamini olish",
    description: "Ochiq (Public) kanallar uchun @kanal_nomi ishlaydi. Maxfiy (Private) kanallar uchun esa -100 bilan boshlanadigan ID raqami kerak bo'ladi (masalan: -100192837465).",
    codeExample: "Public kanal: @playzone_official\nPrivate kanal ID: -100234567890\n\nKanal ID sini @userinfobot yoki @myidbot orqali kanaldan post forward qilib bilib olishingiz mumkin.",
    tip: "Private kanal bo'lsa ham bot kanalda admin bo'lishi kerak."
  },
  {
    step: 4,
    title: "Kodni kompyuterda yoki Serverda ishga tushirish",
    description: "Python 3.10+ o'rnatilgan bo'lishi kerak. Kerakli kutubxonalarni o'rnatib, `python bot.py` buyrug'i orqali ishga tushirasiz.",
    codeExample: "# 1. Loyiha papkasiga o'ting\n# 2. Virtual environment yarating\npython -m venv venv\nsource venv/bin/activate  # (Windows: venv\\Scripts\\activate)\n\n# 3. Kutubxonalarni o'rnating\npip install -r requirements.txt\n\n# 4. Botni ishga tushiring\npython bot.py",
    tip: "24/7 ishlashi uchun Ubuntu VPS serverda `systemd` yoki `screen` / `tmux` dan foydalaning."
  },
  {
    step: 5,
    title: "24/7 Doimiy ishlashi uchun Linux VPS (Systemd) sozlash",
    description: "Bot server o'chib qolganda ham avtomatik qayta yonishi uchun systemd xizmati (service) yaratish tavsiya qilinadi.",
    codeExample: "# /etc/systemd/system/playzonebot.service fayli yaratiladi:\n[Unit]\nDescription=PlayZone Telegram Bot\nAfter=network.target\n\n[Service]\nUser=root\nWorkingDirectory=/var/www/playzonebot\nExecStart=/var/www/playzonebot/venv/bin/python bot.py\nRestart=always\nRestartSec=5\n\n[Install]\nWantedBy=multi-user.target\n\n# Xizmatni yoqish:\nsudo systemctl daemon-reload\nsudo systemctl start playzonebot\nsudo systemctl enable playzonebot",
    tip: "Statusni ko'rish: sudo systemctl status playzonebot"
  }
];

export const commonErrorsFAQ = [
  {
    question: "❌ ChatNotFound yoki MemberNotFound xatoligi nima?",
    answer: "Bu xatolik kanal @username'si xato yozilganda yoki bot o'sha kanalga umuman a'zo/admin qilinmaganda yuzaga keladi. Yechim: Botni kanalga administrator qilib qo'shing va username to'g'riligini tekshiring."
  },
  {
    question: "❌ ChatAdminRequired xatosi nima?",
    answer: "Telegram xavfsizlik qoidalariga ko'ra, bot boshqa foydalanuvchining kanaldagi a'zoligini tekshirishi uchun o'zi ham o'sha kanalda ADMIN huquqiga ega bo'lishi shart. Botni kanalda admin qiling."
  },
  {
    question: "🔒 Yopiq (Private) kanallarni qanday qo'shish mumkin?",
    answer: "Yopiq kanallar uchun @kanal o'rniga -100 bilan boshlanadigan Kanal ID raqami kiritiladi (masalan: -1001847294829) va tugmadagi link uchun kanalning maxsus taklif havolasi (Invite Link) qo'yiladi."
  },
  {
    question: "👥 Referal tizimi qanday ishlaydi?",
    answer: "Har bir foydalanuvchiga `https://t.me/bot_username?start=USER_ID` ko'rinishidagi havola beriladi. Yangi odam ushbu havola orqali kirib kanallarga obuna bo'lganda, taklif qilgan odamga +50 tanga bonus beriladi."
  }
];
