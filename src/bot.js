import { Client, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";
import OpenAI from "openai";

const token = `${process.env.DISCORD_TOKEN}`;
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials : [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ]
});
client.on("ready", () => {
  console.log("Bot ready!");
});

async function callOpenAi(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }], // change here
    model: "gpt-3.5-turbo",
  });

  return completion;
}

function handleEmptyGuilds(discordMessage) {
  callOpenAi(discordMessage.content).then((response) => {
    if (response && response.choices && response.choices.length > 0) {
      discordMessage.reply(`${response.choices[0].message.content.trim()}`);
    } else {
      discordMessage.reply("Sorry can't connect to GPT");
    }
  });
}

function handleNonEmptyGuilds(discordMessage) {
  callOpenAi(discordMessage.content).then((response) => {
    if (response && response.choices && response.choices.length > 0) {
      discordMessage.reply(`${response.choices[0].message.content.trim()}`);
    } else {
      discordMessage.reply("Sorry can't connect to GPT");
    }
  });
}


client.on("messageCreate", function (discordMessage) {
  if (discordMessage.author.bot) return;
  
  if (discordMessage.guildId) {
    // handle dms
    handleEmptyGuilds(discordMessage);
  } else{
    handleNonEmptyGuilds(discordMessage);
  }
  return;
});

client.login(token);
