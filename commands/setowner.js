const discord = require('discord.js')
const config = require('../config/config.json');
const index = require('../index.js');
const sendDM = require('../helpers/dmUser');

module.exports.run = (Client, msg, args, con) => {
    msg.delete();
    if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send({embed: {title: config.messages.no_permission, color: config.embed.color}})
    if (!args[0]) return msg.channel.send({embed: {title: config.messages.user_not_specified, color: config.embed.color}});
    if (msg.mentions.users.first()) return msg.channel.send({embed: {title: config.messages.give_user_id_not_mention, color: config.embed.color}})
    if (!args[1]) return msg.channel.send({embed: {title: config.messages.key_not_specified, color: config.embed.color}});

    con.query(`UPDATE licenses SET owner = ? WHERE license = ?`, [args[1], args[0]], (err, rows) => {
        if (err) index.logger.error(err)

        let embed = new discord.MessageEmbed()
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTitle(config.messages.owner_set);
        sendDM(Client, msg.author.id, embed);
        msg.channel.send({embed: {title: config.messages.sent_to_your_dms, color: config.embed.color}}) 
    })
}
module.exports.help = {
    name: "setowner",
    desc: "Set the owner of a key"
}