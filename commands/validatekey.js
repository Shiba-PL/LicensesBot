const discord = require('discord.js')
const config = require('../config/config.json')
const sendDM = require(process.cwd() + '/helpers/dmUser.js');
const index = require('../index');

module.exports.run = (Client, msg, args, con) => {
    msg.delete();
    if (!msg.member.hasPermission(`ADMINISTRATOR`)) return msg.channel.send({embed: {title: config.messages.no_permission, color: config.embed.color}})
    if (!args[0]) return msg.channel.send({embed: {title: config.messages.key_not_specified, color: config.embed.color}})
    con.query(`SELECT * FROM licenses WHERE license = ?`, [ args[0] ], (err, rows) => {
        if (err) throw index.logger.error(err);

        msg.channel.send({embed: {title: config.messages.sent_to_your_dms, color: config.embed.color}});
        if (rows.length <= 0) {
            sendDM(Client, msg.author.id, {embed: {title: config.messages.key_not_valid, color: config.embed.color}})
        } else if (rows[0].hwid.length <= 0) { // If row's column hwid is empty
            sendDM(Client, msg.author.id, {embed: {title: config.messages.key_valid_but_not_used, color: config.embed.color}})
        } else if (rows[0].hwid.length > 0) {
            sendDM(Client, msg.author.id, {embed: {title: config.messages.key_valid_but_used, color: config.embed.color}})
        } else {
            sendDM(Client, msg.author.id, {embed: {title: config.messages.error_while_validating, color: config.embed.color}})
        }
    })
}

module.exports.help = {
    name: "validatekey",
    desc: "Validate a key and see if it has been activated or not."
}