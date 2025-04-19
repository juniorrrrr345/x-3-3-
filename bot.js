import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';
import Bot from './models/Bot.model.js';
import StatsUser from './models/StatsUser.model.js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';


dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const ADMIN_IDS = [7269541191, 5782647032];
const START_IMAGE_URL = 'https://i.snipboard.io/BHJN1f.jpg';

bot.setMyCommands([{ command: 'start', description: 'Accueil du bot' }]);

const retourButton = (callback_data = 'start') => [
  [{ text: '🔙 Retour', callback_data }]
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userLastMessages = new Map();

const getStartMenu = async () => {
  const botSettings = await Bot.findOne({});
  return [
    [
      ...(botSettings?.lienContact ? [{ text: '💬 Contact', url: botSettings.lienContact }] : []),
      ...(botSettings?.lienCanal ? [{ text: '💾 Canal', url: botSettings.lienCanal }] : [])
    ],
    [{ text: '🛍️ Voir les produits', callback_data: 'view_categories' }]
  ];
};

bot.onText(/\/start/, async (msg) => {
  const { chat: { id: chatId }, from } = msg;
  const botSettings = await Bot.findOne({});
  const { id: userId, username, first_name, last_name, language_code } = from;

  try {
    const startMenu = await getStartMenu();

    const lastMsgId = userLastMessages.get(userId);
    if (lastMsgId) {
      try {
        await bot.deleteMessage(chatId, lastMsgId);
      } catch (err) {
        console.warn('No previous message to delete or already deleted.');
      }
    }

    const sent = await bot.sendPhoto(chatId, START_IMAGE_URL, {
      caption: `👋 *Bienvenue ${first_name || ''} !*\n\n${botSettings.messageBienvenue}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: startMenu }
    });

    userLastMessages.set(userId, sent.message_id);

    const existingUser = await StatsUser.findOne({ id: userId });
    if (!existingUser) {
      await new StatsUser({
        id: userId,
        username,
        first_name,
        last_name,
        language_code,
        lastUsed: new Date()
      }).save();
    }
  } catch (error) {
    console.error('❌ Error in /start handler:', error);
    bot.sendMessage(chatId, 'Une erreur est survenue lors du démarrage. Veuillez réessayer plus tard.');
  }
});

bot.onText(/\/admin/, async (msg) => {
  const { chat: { id: chatId }, from: { id: userId } } = msg;
  if (!ADMIN_IDS.includes(userId)) return;

  const adminMenu = [
    [
      { text: '➕ Ajouter un produit', callback_data: 'add_product' },
      { text: '❌ Supprimer un produit', callback_data: 'delete_product' }
    ],
    [
      { text: '📊 Statistiques', callback_data: 'view_stats' },
      { text: '🔍 Rechercher un utilisateur', callback_data: 'search_user' }
    ],
    [
      { text: '📝 Modifier le message de bienvenue', callback_data: 'edit_welcome' },
      { text: '☎️ Modifier le contact', callback_data: 'edit_contact' }
    ],
    [
      { text: '🔗 Modifier le lien du contact', callback_data: 'edit_contact_link' },
      { text: '🔗 Modifier le lien du canal', callback_data: 'edit_channel_link' }
    ]
  ];

  await bot.sendMessage(chatId, '🎛 *Panneau Admin*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: adminMenu }
  });
});

const askQuestion = (chatId, question) => {
  return new Promise((resolve) => {
    bot.sendMessage(chatId, question);
    bot.once('message', (msg) => resolve(msg.text));
  });
};

bot.on('callback_query', async ({ data, message }) => {
  const { chat: { id: chatId } } = message;

  try {
    switch (true) {
      case data === 'start': {
        const startMenu = await getStartMenu();
        const botSettings = await Bot.findOne({});
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendPhoto(chatId, START_IMAGE_URL, {
          caption: `👋 *Bienvenue !*\n\n${botSettings.messageBienvenue}`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: startMenu }
        });
        break;
      }

      case data === 'admin': {
        if (!ADMIN_IDS.includes(message.from.id)) return;
        const adminMenu = [
          [
            { text: '➕ Ajouter un produit', callback_data: 'add_product' },
            { text: '❌ Supprimer un produit', callback_data: 'delete_product' }
          ],
          [
            { text: '📊 Statistiques', callback_data: 'view_stats' },
            { text: '🔍 Rechercher un utilisateur', callback_data: 'search_user' }
          ],
          [
            { text: '📝 Modifier le message de bienvenue', callback_data: 'edit_welcome' },
            { text: '☎️ Modifier le contact', callback_data: 'edit_contact' }
          ],
          [
            { text: '🔗 Modifier le lien du contact', callback_data: 'edit_contact_link' },
            { text: '🔗 Modifier le lien du canal', callback_data: 'edit_channel_link' }
          ]
        ];
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendMessage(chatId, '🎛 *Panneau Admin*', {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: adminMenu }
        });
        break;
      }

      case data === 'view_categories': {
        const categories = await Product.distinct('category');
        const categoryButtons = categories.map(cat => [{ text: cat, callback_data: `view_category_${cat}` }]);
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendMessage(chatId, 'Choisissez une catégorie :', {
          reply_markup: { inline_keyboard: [...categoryButtons, ...retourButton()] }
        });
        break;
      }

      case data.startsWith('view_category_'): {
        const category = data.split('view_category_')[1];
        const products = await Product.find({ category });
        const productButtons = products.map(p => [{ text: p.name, callback_data: `view_product_${p._id}` }]);
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendMessage(chatId, `Produits dans "${category}" :`, {
          reply_markup: { inline_keyboard: [...productButtons, ...retourButton('view_categories')] }
        });
        break;
      }

      case data.startsWith('view_product_'): {
        const id = data.split('view_product_')[1];
        const product = await Product.findById(id);
        if (!product) return bot.sendMessage(chatId, '❌ Produit introuvable.');

        let messageText = `✨ *${product.name}*\n\n${product.description}\n\nPrix :\n`;
        product.prices.forEach(p => messageText += `${p.gram} - ${p.price}€\n`);

        await bot.deleteMessage(chatId, message.message_id);
        if (product.image) await bot.sendPhoto(chatId, product.image);

        const keyboard = [
          [{ text: '🔙 Retour', callback_data: `view_category_${product.category}` }],
          ...(product.video ? [[{ text: 'Suivant ▶️', callback_data: `next_product_${product._id}` }]] : [])
        ];

        await bot.sendMessage(chatId, messageText, {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: keyboard }
        });
        break;
      }

      case data === 'view_stats': {
        const totalUsers = await StatsUser.countDocuments();
        await bot.sendMessage(chatId, `📊 Nombre total d'utilisateurs : ${totalUsers}`);
        break;
      }

      case data === 'search_user': {
        bot.sendMessage(chatId, '🔎 Entrez @username ou ID :');
        bot.once('message', async (msg) => {
          const query = msg.text.replace('@', '');
          const user = await StatsUser.findOne({ $or: [{ username: query }, { id: query }] });
          if (!user) return bot.sendMessage(chatId, '❌ Utilisateur introuvable.');
          await bot.sendMessage(chatId, `👤 Utilisateur trouvé :\n\nID : ${user.id}\nNom : ${user.first_name}\nUsername : @${user.username}`);
        });
        break;
      }

      case data.startsWith('edit_'): {
        const fieldMap = {
          edit_welcome: 'messageBienvenue',
          edit_contact: 'contact',
          edit_contact_link: 'lienContact',
          edit_channel_link: 'lienCanal'
        };

        const field = fieldMap[data];
        if (field) {
          bot.sendMessage(chatId, `✏️ Nouvelle valeur pour *${field.replace(/([A-Z])/g, ' $1')}* :`, { parse_mode: 'Markdown' });
          bot.once('message', async (msg) => {
            const value = msg.text;
            await Bot.findOneAndUpdate({}, { [field]: value }, { upsert: true });
            bot.sendMessage(chatId, `✅ ${field} mis à jour.`);
          });
        }
        break;
      }

      case data === 'delete_product': {
        const categories = await Product.distinct('category');
        const buttons = categories.map(cat => [{ text: cat, callback_data: `delete_category_${cat}` }]);
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendMessage(chatId, 'Choisissez la catégorie à nettoyer :', {
          reply_markup: { inline_keyboard: [...buttons, ...retourButton('admin')] }
        });
        break;
      }

      case data.startsWith('delete_category_'): {
        const category = data.split('delete_category_')[1];
        const products = await Product.find({ category });
        const buttons = products.map(p => [{ text: p.name, callback_data: `confirm_delete_${p._id}` }]);
        await bot.deleteMessage(chatId, message.message_id);
        await bot.sendMessage(chatId, `Produits dans "${category}" :`, {
          reply_markup: { inline_keyboard: [...buttons, ...retourButton('delete_product')] }
        });
        break;
      }

      case data.startsWith('confirm_delete_'): {
        const id = data.split('confirm_delete_')[1];
        const product = await Product.findById(id);
        if (!product) return bot.sendMessage(chatId, '❌ Produit introuvable.');
        await Product.deleteOne({ _id: id });
        await bot.sendMessage(chatId, `✅ "${product.name}" supprimé.`);
        break;
      }

      case data === 'add_product': {
        const name = await askQuestion(chatId, '🔢 Nom du produit ?');
        const description = await askQuestion(chatId, '📝 Description ?');
        const category = await askQuestion(chatId, '📂 Catégorie ?');
        const priceInput = await askQuestion(chatId, '💶 Prix (ex: 1g=10€, 2g=18€) ?');
        const prices = priceInput.split(',').map(p => {
          const [g, e] = p.split('=');
          return { gram: g.trim(), price: parseFloat(e.trim()) };
        });
      
        await bot.sendMessage(chatId, '📸 Envoyez une *photo ou vidéo* du produit maintenant.', { parse_mode: 'Markdown' });
      
        bot.once('message', async (msg) => {
          const file = msg.photo?.pop() || msg.video;
          if (!file) return bot.sendMessage(chatId, '❌ Fichier non reconnu.');
      
          const fileId = file.file_id;
          const fileInfo = await bot.getFile(fileId);
          const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
          const fileName = path.basename(fileInfo.file_path);
          const filePath = `./temp/${fileName}`;
          const fileStream = fs.createWriteStream(filePath);
      
          const res = await fetch(fileUrl);
          await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on('error', reject);
            fileStream.on('finish', resolve);
          });
      
          let finalUrl = '';
      
          if (msg.photo) {
            // Upload to telegra.ph for images
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));
      
            const uploadRes = await fetch('https://telegra.ph/upload', {
              method: 'POST',
              body: form
            });
            const result = await uploadRes.json();
      
            if (result[0]?.src) {
              finalUrl = 'https://telegra.ph' + result[0].src;
            }
          } else if (msg.video) {
            // Keep Telegram CDN link for video
            finalUrl = fileUrl;
          }
      
          fs.unlinkSync(filePath);
      
          const newProduct = new Product({
            name,
            description,
            category,
            prices,
            image: msg.photo ? finalUrl : undefined,
            video: msg.video ? finalUrl : undefined
          });
      
          await newProduct.save();
          await bot.sendMessage(chatId, `✅ Produit "${name}" ajouté avec ${msg.photo ? 'photo' : 'vidéo'} !`);
        });
      
        break;
      }

      default:
        await bot.sendMessage(chatId, '❌ Une erreur s’est produite. Veuillez réessayer.');
    }
  } catch (err) {
    console.error('❌ Callback Error:', err);
    await bot.sendMessage(chatId, '❌ Une erreur interne est survenue.');
  }
});
