const discord = require('discord.js');
const config = require('../config/config.json');

module.exports.run = async (Client, msg, args, con) => {
    let commands = [...Client.commands.values()];
    const embed = new discord.MessageEmbed()
    .setColor(config.embed.color)
    .setFooter(config.embed.footer);
    commands.forEach(cmd => {
        embed.addField(cmd.help.name, cmd.help.desc, true);
    });
    msg.channel.send(embed)
}
module.exports.help = {
    name: "help",
    desc: "Show the help menu."
}