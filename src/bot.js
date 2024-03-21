import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import OpenAI from "openai";

const token = `${process.env.DISCORD_TOKEN}`;
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
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

client.on("messageCreate", function (discordMessage) {
  if (discordMessage.author.bot) return;
  discordMessage.reply(`Loading please wait...`);

  callOpenAi(discordMessage.content).then((response) => {
    if (response && response.choices && response.choices.length > 0) {
      discordMessage.reply(`${response.choices[0].message.content.trim()}`);
    } else {
      discordMessage.reply("Sorry can't connect to GPT");
    }
  });
  return;
});
client.login(token);
