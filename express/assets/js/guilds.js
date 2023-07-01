
fetch('/guilds').then(response => response.json()).then(guilds => {
    const guildsContainer = document.getElementById('guilds');
    guilds.forEach(guild => {
        const logoElement = document.createElement('div');
        logoElement.id = guild.id+'1'
        logoElement.classList.add('logo-guild');
        const logoImg = document.createElement('img');
        logoImg.src = guild.iconUrl || 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png';
        logoImg.alt = guild.name;
        logoImg.id = guild.id

        logoImg.addEventListener('click', event => {
            const ativar = document.getElementById(event.target.id+'1')
            var elementos = document.getElementsByClassName("guild-ativo");
            for (var j = 0; j < elementos.length; j++) {
                elementos[j].classList.remove("guild-ativo");
            }
            ativar.classList.add('guild-ativo')
            guildChannels(event.target.id, guild.name)
          });
        logoElement.appendChild(logoImg);
        guildsContainer.appendChild(logoElement);
    })
})

function guildChannels(id, name){
    fetch(`/channels/${id}`).then(response => response.json()).then(channels => {
        const guildName = document.getElementById('guild-name')
        guildName.textContent = name
        const channelsContainer = document.getElementById('channels-main');
        channelsContainer.innerHTML = '';
        channels.forEach(channel => {
            const channelElement = document.createElement('div')
            channelElement.classList.add('channel')
            channelElement.id = channel.id
            channelElement.textContent = `# `+channel.name

            channelsContainer.appendChild(channelElement);
            channelElement.addEventListener('click', event => {
                const ativar = document.getElementById(event.target.id)
                var elementos = document.getElementsByClassName("channel-ativo");
                for (var j = 0; j < elementos.length; j++) {
                    elementos[j].classList.remove("channel-ativo");
                }
                ativar.classList.add('channel-ativo')
                messagesChannels(id, event.target.id, channel.name)
            });
        })
    })

}
function messagesChannels(guild,id, name){
    const channelName = document.getElementById('chat-header')
    channelName.textContent = "# "+name

    const chatContainer = document.getElementById('chat-display');
    chatContainer.innerHTML = '';
    fetch(`/messages/${id}`).then(response => response.json()).then(messages => {
        messages.forEach(message => {
            const messageElement = document.createElement('div')
            messageElement.classList.add('message')


            const avatarElement = document.createElement('img');
            avatarElement.classList.add('message-icon')
            if(message.user.avatar){
                avatarElement.src = `https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}${message.user.avatar.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096'}`
            }
            else{
                avatarElement.src = 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png';
            }
            
            avatarElement.alt = message.user.username;

            const messagebodyElement = document.createElement('div')
            messagebodyElement.classList.add('message-body')

            const messageheaderElement = document.createElement('div')
            messageheaderElement.classList.add('message-header')
            messageheaderElement.textContent = `@${message.user.username}`

            const messageDataElement = document.createElement('p')
            let data = new Date(message.data)
            messageDataElement.textContent = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`

            const messagecontentElement = document.createElement('div')
            messagecontentElement.classList.add('message-content')
            messagecontentElement.textContent = message.content
            

            messageheaderElement.appendChild(messageDataElement)
            messagebodyElement.appendChild(messageheaderElement)
            messagebodyElement.appendChild(messagecontentElement)
            if(message.embeds.length > 0 &&!message.content.startsWith('https://media.discordapp.net/attachments/' )){
                message.embeds.forEach(embed => {
                    const messageembedElement = document.createElement('div')
                    messageembedElement.classList.add('message-embed')

                    const embedElement = document.createElement('div')
                    embedElement.classList.add('embed')

                    const messageembedoneElement = document.createElement('div')
                    messageembedoneElement.classList.add('message-embed-one')
                    if(embed.author){
                        const embedauthorElement = document.createElement('div')
                        embedauthorElement.classList.add('embed-author')

                        const authorimageElement = document.createElement('img')
                        authorimageElement.src = embed.author.icon_url
                        embedauthorElement.appendChild(authorimageElement)

                        const embedauthornameElement = document.createElement('div')
                        embedauthornameElement.classList.add('embed-author-name')
                        embedauthornameElement.textContent = embed.author.name
                        embedauthorElement.appendChild(embedauthornameElement)
                        
                        messageembedoneElement.appendChild(embedauthorElement)
                    }
                    const embedmainElement = document.createElement('div')
                    embedmainElement.classList.add('embed-main')

                    if(embed.title){
                        const embedtitleElement = document.createElement('div')
                        embedtitleElement.classList.add('embed-title')
                        embedtitleElement.textContent = embed.title
                        embedmainElement.appendChild(embedtitleElement)
                    }
                    if(embed.description){
                        const embeddescriptionElement = document.createElement('div')
                        embeddescriptionElement.classList.add('embed-description')
                        embeddescriptionElement.textContent = embed.description
                        embedmainElement.appendChild(embeddescriptionElement)
                    }
                    const messageembedtwoElement = document.createElement('div')
                    messageembedtwoElement.classList.add('message-embed-two')
                    if(embed.thumbnail){                        
                        const messagethumbnailElement = document.createElement('img')
                        messagethumbnailElement.src = embed.thumbnail.url

                        messageembedtwoElement.appendChild(messagethumbnailElement)
                    }
                    messageembedElement.appendChild(embedElement)
                    if(embed.image){
                        const embedimageElement = document.createElement('img')
                        embedimageElement.classList.add('embed-image')
                        embedimageElement.src = embed.thumbnail.url

                        messageembedElement.appendChild(embedimageElement)
                    }
                    messageembedoneElement.appendChild(embedmainElement)
                    embedElement.appendChild(messageembedoneElement)
                    embedElement.appendChild(messageembedtwoElement)
                    
                    messagebodyElement.appendChild(messageembedElement)
                    
                    // if(embed.image){
                    //     const messageimageElement = document.createElement('img')
                    //     messageimageElement.classList.add('message-image')

                    //     messageimageElement.src = embed.image.url
                    // }

                })
            }
            if(message.image || message.content.startsWith('https://media.discordapp.net/attachments/')){
                const messageimageElement = document.createElement('div')
                messageimageElement.classList.add('message-image')
                messagebodyElement.appendChild(messageimageElement)
                if(message.content.startsWith('https://media.discordapp.net/attachments/')){
                    const messageurlimageElement = document.createElement('img')
                    messageurlimageElement.src = message.content;
                    messageurlimageElement.alt = 'image';
                    messageimageElement.appendChild(messageurlimageElement)
                }
                
                message.image.forEach(image => {
                    const messageurlimageElement = document.createElement('img')
                    messageurlimageElement.src = image.url || message.content;
                    messageurlimageElement.alt = 'image';
                    messageimageElement.appendChild(messageurlimageElement)
                })
            }
            messageElement.appendChild(avatarElement)
            messageElement.appendChild(messagebodyElement)
            chatContainer.appendChild(messageElement)

        })
    })
}

const meuElemento = document.getElementById('guilds');

meuElemento.addEventListener('wheel', (event) => {
  // Detectar o movimento da roda do mouse
  const delta = Math.sign(event.deltaY);

  // Rolar o conteúdo para cima ou para baixo
  meuElemento.scrollTop += delta * 100; // Você pode ajustar o valor da rolagem conforme necessário
});
const meuElemento2 = document.getElementById('channels');

meuElemento2.addEventListener('wheel', (event) => {
  // Detectar o movimento da roda do mouse
  const delta = Math.sign(event.deltaY);

  // Rolar o conteúdo para cima ou para baixo
  meuElemento2.scrollTop += delta * 50; // Você pode ajustar o valor da rolagem conforme necessário
});

const meuElemento3 = document.getElementById('chat-main');

meuElemento3.addEventListener('wheel', (event) => {
  // Detectar o movimento da roda do mouse
  const delta = Math.sign(event.deltaY);

  // Rolar o conteúdo para cima ou para baixo
  meuElemento3.scrollTop += delta * 50; // Você pode ajustar o valor da rolagem conforme necessário
});


const buttoenviar = document.getElementById('button-enviar')

document.addEventListener("keypress", function(event) {
    if (event.key  === "Enter") {
        const channel = document.getElementsByClassName('channel-ativo')
        const message = document.getElementById('input')
        let id = null
        for (var i = 0; i < channel.length; i++) {
            id = channel[i].id;       
        }
        if(!message.value){
            return
        }
        fetch(`/send/${id}/${message.value}`).then(response => response.json()).then(message => {
            const chatContainer = document.getElementById('chat-display');
            const messageElement = document.createElement('div')
                messageElement.classList.add('message')
    
    
                const avatarElement = document.createElement('img');
                avatarElement.classList.add('message-icon')
                if(message.user.avatar){
                    avatarElement.src = `https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}${message.user.avatar.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096'}`
                }
                else{
                    avatarElement.src = 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png';
                }
                
                avatarElement.alt = message.user.username;
    
                const messagebodyElement = document.createElement('div')
                messagebodyElement.classList.add('message-body')
    
                const messageheaderElement = document.createElement('div')
                messageheaderElement.classList.add('message-header')
                messageheaderElement.textContent = `@${message.user.username}`
    
                const messageDataElement = document.createElement('p')
                let data = new Date(message.data)
                messageDataElement.textContent = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`
                
                const messagecontentElement = document.createElement('div')
                messagecontentElement.classList.add('message-content')
                messagecontentElement.textContent = message.content
    
                messageheaderElement.appendChild(messageDataElement)
                messagebodyElement.appendChild(messageheaderElement)
                messagebodyElement.appendChild(messagecontentElement)
    
                messageElement.appendChild(avatarElement)
                messageElement.appendChild(messagebodyElement)
                var elementosAnteriores = document.getElementsByClassName("message");
                var primeiroElementoAnterior = elementosAnteriores[0];
    
                if (primeiroElementoAnterior) {
                    // Adiciona a nova div antes do elemento anterior
                    primeiroElementoAnterior.parentNode.insertBefore(messageElement, primeiroElementoAnterior);
                  } else {
                    // Caso não encontre o elemento anterior, adiciona a nova div no final do documento
                    chatContainer.append(messageElement)
                  }
    
                const input = document.getElementById('input')
                input.value = ''
        })
    }
  });
buttoenviar.addEventListener('click', event => {
    
    const channel = document.getElementsByClassName('channel-ativo')
    const message = document.getElementById('input')
    let id = null
    for (var i = 0; i < channel.length; i++) {
        id = channel[i].id;       
    }
    if(!message.value){
        return
    }
    fetch(`/send/${id}/${message.value}`).then(response => response.json()).then(message => {
        const chatContainer = document.getElementById('chat-display');
        const messageElement = document.createElement('div')
            messageElement.classList.add('message')


            const avatarElement = document.createElement('img');
            avatarElement.classList.add('message-icon')
            if(message.user.avatar){
                avatarElement.src = `https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}${message.user.avatar.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096'}`
            }
            else{
                avatarElement.src = 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-wooh9l0j.png';
            }
            
            avatarElement.alt = message.user.username;

            const messagebodyElement = document.createElement('div')
            messagebodyElement.classList.add('message-body')

            const messageheaderElement = document.createElement('div')
            messageheaderElement.classList.add('message-header')
            messageheaderElement.textContent = `@${message.user.username}`

            const messagecontentElement = document.createElement('div')
            messagecontentElement.classList.add('message-content')
            messagecontentElement.textContent = message.content

            messagebodyElement.appendChild(messageheaderElement)
            messagebodyElement.appendChild(messagecontentElement)

            messageElement.appendChild(avatarElement)
            messageElement.appendChild(messagebodyElement)
            var elementosAnteriores = document.getElementsByClassName("message");
            var primeiroElementoAnterior = elementosAnteriores[0];

            if (primeiroElementoAnterior) {
                // Adiciona a nova div antes do elemento anterior
                primeiroElementoAnterior.parentNode.insertBefore(messageElement, primeiroElementoAnterior);
              } else {
                // Caso não encontre o elemento anterior, adiciona a nova div no final do documento
                chatContainer.append(messageElement)
              }

            const input = document.getElementById('input')
            input.value = ''
    })
})
