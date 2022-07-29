module.exports.run = (Client, msg, args, mysql) => {
    msg.channel.send("Pong!")
}
module.exports.help = {
    name: "ping",
    desc: "Pong!"
}