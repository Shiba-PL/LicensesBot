const discord = require('discord.js')
const config = require('../config/config.json');
const expDate = require('../helpers/generateExpDate');
const sendDM = require('../helpers/dmUser');
const index = require('../index');
const generateKey = require('../helpers/generateKey');


module.exports.run = (Client, msg, args, con) => {
    if (!msg.member.hasPermission("ADMINISTRATOR")) return;
    if (!args[0]) return msg.channel.send({embed: {title: config.messages.no_owner_specified, color: config.embed.color}})
    if (msg.mentions.users.first()) return msg.channel.send({embed: {title: config.messages.give_user_id_not_mention, color: config.embed.color}})
    let license = generateKey();
    index.con.query(`INSERT INTO licenses (license,expire,hwid,created,owner) VALUES(?,?,'',?,?)`, [license, args[1] ? expDate(args[0]) : `0`, Math.floor((new Date()).getTime() / 1000), args[0].toLowerCase() != "nobody" ? msg.guild.member(args[0]).id : "Nobody"], (err, rows) => {
        if (err) throw err;
        msg.channel.send({embed: {title: config.messages.sent_to_your_dms, color: config.embed.color}});
        sendDM(Client, msg.author.id, {embed: {title: config.messages.here_is_key.replace("$key", license), color: config.embed.color}});
    });
}

module.exports.help = {
    name: "generatekey",
    desc: "Generate a license."
}