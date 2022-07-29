const fs = require('fs')

function databaseChecks(mysqlConnection, logger) {
    return new Promise((resolve, reject) => {
        let con = mysqlConnection;
        if (require(process.cwd() + '/config/config.json').dbinit === false) {
            logger.info("MySQL Database not setup. Setting it up now.")
            con.query(`CREATE TABLE \`licenses\` (
                \`license\` varchar(50) NOT NULL,
                \`expire\` varchar(30) NOT NULL,
                \`hwid\` varchar(99) NOT NULL,
                \`created\` varchar(25) NOT NULL,
                PRIMARY KEY (\`license\`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, (err, rows) => {
                if (err) throw logger.error(new Error(err))
                logger.info("Finished creating tables")
            });

            fs.readFile(process.cwd() + '/config/config.json', {encoding: 'utf-8'}, (err, data) => {
                let config = JSON.parse(data);
                config.dbinit = true;

                fs.writeFileSync(process.cwd() + '/config/config.json', JSON.stringify(config, null, "\t"));
                delete require.cache[require.resolve(process.cwd() + '/config/config.json')]
            })
        }
    })
}
module.exports = databaseChecks;