require('dotenv').config(); //Carrega Todas As Variáveis Do .env

const express = require('express');
const app = express();
const port = 4200;

const token = process.env.TOKEN; //Acessa O Token Do BOT Pela Variavel Do .env

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

// Configuração Inicial Do BOT Discord
client.on('ready', () => {
  console.log(`[Painel] BOT Iniciado Como: ${client.user.tag}`);
});

app.use(express.static(__dirname + '/assets'));

app.get('/guilds', (req, res) => {
  const guilds = client.guilds.cache.map(guild => {
    return {
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL()
    };
  });
  res.json(guilds);
});

app.get('/channels/:guildId', (req, res) => {

  const guildId = req.params.guildId;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: 'Servidor Não Encontrado' });
  }
  const channelNames = guild.channels.cache.filter(channel => channel.type === 0).map(channel => ({
    id: channel.id,
    name: channel.name
  }));
  res.json(channelNames);
});
app.get('/send/:channelId/:messageContent', async (req, res) => {
  const channeld = req.params.channelId;
  const messageContent = req.params.messageContent;

  const channel = client.channels.cache.get(channeld);
  if(channel){
    channel.send(messageContent).then(msg => {
      res.json({user: {username: msg.author.username, avatar: msg.author.avatar, id: msg.author.id}, content: msg.content, data: msg.createdTimestamp})
    })
  }
})
app.get('/messages/:channelId', async (req, res) => {

  try {
    const channelId = req.params.channelId;

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Servidor Não Encontrado!' });
    }


    const messages = await channel.messages.fetch({ limit: 100 })
    let mensagem = []
    messages.forEach(message => {
      if(message){
        mensagem.push({user: {username: message.author.username, avatar: message.author.avatar, id: message.author.id}, content: message.content, data: message.createdTimestamp})
      }else{
        mensagem.push[{user: {username: client.user.username, avatar: client.user.avatar, id: client.user.id}, content: `Nenhuma Mensagem Encontrada!`, data: null}]
      }
      
    });
    res.json(mensagem);
  } catch (error) {
    mensagem = [{user: {username: client.user.username, avatar: client.user.avatar, id: client.user.id}, content: `Nenhuma Mensagem Encontrada!`}]
    res.json(mensagem);
  }
  

  
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/APP/Home/index.html');
});


app.listen(port, () => {
  console.log(`[Servidor] Está Rodando Em: http://localhost:${port}`);
});

client.login(token)

module.exports = client;