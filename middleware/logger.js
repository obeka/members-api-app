const fs = require('fs');
const path = require('path')
const moment = require('moment');

const logger = (req, res, next) => {
    const logHistoryStr = `${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format('llll')}\n`;

    fs.appendFile(path.join(__dirname, '../logHistory.txt'), logHistoryStr, (err, content) => {
        if (err) throw err;
        console.log('The log has been saved!');
    })
    next();
}

module.exports = logger;