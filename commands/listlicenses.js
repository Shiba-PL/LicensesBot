const discord = require('discord.js');
const index = require('../index.js')
const config = require('../config/config.json')
const sendDM = require('../helpers/dmUser');

module.exports.run = (Client, msg, args, con) => {
    if (args[0]) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send({embed: {title: config.messages.no_permission, color: config.embed.color}});
        let user;
        args[0].toLowerCase() !== "nobody" ? user = Client.users.resolve(args[0]) : user = {id: "nobody", username: "Nobody"};
        con.query(`SELECT * FROM licenses WHERE owner = ?`, [user.id], (err, rows) => {
            if (err) index.logger.error(err);

            let licenses = [];
            rows.forEach(r => {
                licenses.push("" + r.license.toString() + "");
            });

            if (rows.length <= 0) {
                let embed = new discord.MessageEmbed()
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setAuthor(config.messages.licenses_for_username.replace("$user", user.username))
                .setDescription("No licenses for user.");
                msg.channel.send(config.messages.sent_to_your_dms);
                sendDM(Client, msg.author.id, embed);
            } else {
                let embed = new discord.MessageEmbed()
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setAuthor(config.messages.licenses_for_username.replace("$user", user.username))
                .setDescription(licenses.join("\n"));
                msg.channel.send(config.messages.sent_to_your_dms)
                sendDM(Client, msg.author.id, embed);
            }
        })
    } else {
        con.query(`SELECT * FROM licenses WHERE owner = ?`, [msg.author.id], (err, rows) => {
            if (err) index.logger.error(err);

            let licenses = [];
            rows.forEach(r => {
                licenses.push(`${r.license}`);
            });

            if (rows.length <= 0) {
                let embed = new discord.MessageEmbed()
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setAuthor(config.messages.licenses_for_username.replace("$user", msg.author.username))
                .setDescription("No licenses for user.");
                msg.channel.send(config.messages.sent_to_your_dms);
                sendDM(Client, msg.author.id, embed);
            } else {
                let embed = new discord.MessageEmbed()
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setAuthor(config.messages.licenses_for_username.replace("$user", msg.author.username))
                .setDescription(licenses.join("\n"));
                msg.channel.send(config.messages.sent_to_your_dms)
                sendDM(Client, msg.author.id, embed);
            }
        })
    }
}
module.exports.help = {
    name: "listlicenses",
    desc: "View your license keys."
}