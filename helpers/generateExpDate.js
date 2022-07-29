const ms = require('ms');
function generateExpDate(expiry) {
    let now = Math.round((new Date()).getTime() / 1000);
    let howlong = Math.floor(ms(expiry) / 1000);
    let exp = now + howlong;
    return exp;
}
module.exports = generateExpDate;