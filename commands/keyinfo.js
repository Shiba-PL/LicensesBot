const discord = require('discord.js')
const config = require('../config/config.json')
const sendDM = require('../helpers/dmUser');
const index = require('../index');

module.exports.run = (Client, msg, args, con) => {
    msg.delete();
    if (!args[0]) return msg.channel.send({embed: {title: config.messages.key_not_specified, color: config.embed.color}});
    if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send({embed: {title: config.messages.no_permission, color: config.embed.color}});
    con.query(`SELECT * FROM licenses WHERE license = ?`, [ args[0] ], (err, rows) => {
        if (err) throw index.logger.error(err)

        msg.channel.send({embed: {title: config.messages.sent_to_your_dms, color: config.embed.color}});
        if (rows.length <= 0) {
            sendDM(Client, msg.author.id, {embed: {title: config.messages.key_not_valid, color: config.embed.color}})
        } else if (rows[0]) {
            let embed = new discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor(config.messages.keyinfo.title)
            .addField(config.messages.keyinfo.license_key, `\`${args[0]}\``, true)
            .addField(config.messages.keyinfo.created_on, (new Date(rows[0].created * 1000)).toString(), true)
            .addField(config.messages.keyinfo.expiry_date, rows[0].expire !== 0 ? (new Date(rows[0].expire * 1000)).toString() : "Never", true)
            .addField(config.messages.keyinfo.owner, `${rows[0].owner ? rows[0].owner.toLowerCase() == "Nobody" ? "Nobody" : `<@${rows[0].owner}> (${rows[0].owner})` : `Nobody`}`, true)
            .addField(config.messages.keyinfo.hwid, `${rows[0].hwid.length > 0 ? `\`${rows[0].hwid}\`` : `None`}`, true);
            sendDM(Client, msg.author.id, embed);
        }
    })
}

module.exports.help = {
    name: "keyinfo",
    desc: "View information for a license key"
}