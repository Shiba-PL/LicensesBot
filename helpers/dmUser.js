function dmUser(Client, userid, message) {
    return new Promise((resolve, reject) => {
        let user = Client.users.cache.get(userid)
        user.send(message).then(resolve).catch(reject)
    })
}
module.exports = dmUser;