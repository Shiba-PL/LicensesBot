const uuid = require('uuid')
const config = require('../config/config.json')

module.exports = () => {
    switch (config.keyformat) {
        case "uuidv4":
            return uuid.v4();
            break;
        case "uuidv1":
            return uuid.v1();
            break;
        case "custom1":
            // Your custom key generation code here
            break;
        default:
            return uuid.v4();
    }
}