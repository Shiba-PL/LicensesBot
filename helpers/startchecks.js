const request = require('request');

function startupChecks() {
    // Verify nodejs version
    if (parseInt(process.version.split(".")[0].split("v")[1]) < '12') {
        throw new Error("Please ensure Node.JS version is 12 or above.");
    }
    // i dont know why but trying to understand < and > to compare nodejs version feels like im a 4 year old
    // well its good now

    // Update checker

    request("http://s1.eu.quantumsoul.xyz:5746/v1/licensebot/version", {
        method: 'GET'
    }, (err, res, body) => {
        if (err) throw err;
        body = JSON.parse(body);
        if (require('../package.json').version !== body.version) {
            console.warn(`
            =======================================

            There is a new version available for LicenseBot.
            Contact Quantum#6014 or download the new version from mc market

            =======================================
            `)
        }
    })
}

module.exports = startupChecks;
