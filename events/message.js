const discord = require('discord.js');
const index = require('../index');
const config = require('../config/config.json')

module.exports = (Client, msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;

    let messageArray = msg.content.split(/ +/g);
    let args = messageArray.slice(1);
    let cmd = messageArray[0].slice(config.prefix.length);

    let commandFile = Client.commands.get(cmd)
    // if command file found run it
    if (commandFile) {
        commandFile.run(Client, msg, args, index.con)
        // Arguements in order:
        // Client
        // msg
        // args
        // con (mysql connection)
        // You know, im kind of silent whem im coding, not just in real life (unless in a call), but in code as well. For example i realise it now. I try and comment stuff
    }
}