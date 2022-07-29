const discord = require('discord.js');
const config = require('../config/config.json');
const index = require('../index');
const sendDM = require('../helpers/dmUser');

module.exports.run = (Client, msg, args, con) => {
    msg.delete();
    if (!args[0]) return msg.channel.send({embed: {title: config.messages.key_not_specified, color: config.embed.color}});
    if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send({embed: {title: config.messages.no_permission, color: config.embed.color}});
    con.query(`SELECT * FROM licenses WHERE license = ?`, [ args[0] ], (err, rows) => {
        if (err) throw index.logger.error(err)

        if (rows.length <= 0) {
            sendDM(Client, msg.author.id, {embed: {title: config.messages.key_not_valid, color: config.embed.color}})
        } else if (rows[0]) {
            con.query(`DELETE from licenses WHERE license = ?`, [ args[0] ], (err, rows) => {
                if (err) throw index.logger.error(err)
                msg.channel.send({embed: {title: config.messages.key_deleted, color: config.embed.color}})
            })
        }
    })
}

module.exports.help = {
    name: "deletekey",
    desc: "Delete a license key"
}