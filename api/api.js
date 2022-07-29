const express = require('express');
const index = require('../index');

class api {
    app;

    constructor(con) {
        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true
        }))
        this.app.use((req, res, next) => {
            index.con.connect((err) => {
                if (err) throw err;
                index.logger.info(`${req.method} request on ${req.originalUrl} from ${req.ip}`);
                next();
                index.con.end();
            })
        });

        this.app.post('/v1/activate', (req, res) => {
            let data = req.body;
            if (!data.license || !data.hwid) return res.json({
                message: "Invalid license or hardware ID."
            });
            con.query(`SELECT * FROM licenses WHERE license = ?`, [data.license], (err, rows) => {
                if (err) {
                    res.status(500);
                    res.json({
                        message: "An error occured on the server."
                    });
                    return index.logger.error(err);
                }

                if (rows[0]) {
                    if (rows[0].expire < Math.floor((new Date()).getTime() / 1000 && rows[0].expire !== "0")) {
                        res.status(200);
                        return res.json({
                            message: "Key expired"
                        });
                    }
                    if (rows[0].hwid.length > 0) {
                        res.status(200);
                        return res.json({
                            message: "Key used"
                        });
                    }

                    con.query(`UPDATE licenses SET hwid = ? WHERE license = ?`, [data.hwid, data.license], (err, rows) => {
                        if (err) {
                            res.status(500);
                            res.json({
                                message: "An error occured on the server."
                            });
                            return index.logger.error(err);
                        }

                        res.status(200)
                        res.json({
                            message: "activated"
                        })
                    })
                } else {
                    res.status(200);
                    return res.json({
                        message: "Invalid key"
                    });
                }
            })
        });
        
        this.app.post('/v1/resethwid', (req, res) => {
            let data = req.body;
            if (!data.license) return res.json({
                message: "Invalid license."
            });
            con.query(`SELECT * FROM licenses WHERE license = ?`, [data.license], (err, rows) => {
                if (err) {
                    res.status(500);
                    res.json({
                        message: "An error occured on the server."
                    });
                    return index.logger.error(err);
                }

                if (rows[0]) {
                    if (rows[0].expire < Math.floor((new Date()).getTime() / 1000 && rows[0].expire !== "0")) {
                        res.status(200);
                        return res.json({
                            message: "Key expired"
                        });
                    }

                    con.query(`UPDATE licenses SET hwid = "" WHERE license = ?`, [data.license], (err, rows) => {
                        if (err) {
                            res.status(500);
                            res.json({
                                message: "An error occured on the server."
                            });
                            return index.logger.error(err);
                        }

                        res.status(200)
                        res.json({
                            message: "reset"
                        })
                    })
                } else {
                    res.status(200);
                    return res.json({
                        message: "Invalid key"
                    });
                }
            })
        })

        this.app.post('/v1/deletekey', (req, res) => {
            let data = req.body;
            if (!data.license) return res.json({
                message: "Invalid license."
            });
            con.query(`SELECT * FROM licenses WHERE license = ?`, [data.license], (err, rows) => {
                if (err) {
                    res.status(500);
                    res.json({
                        message: "An error occured on the server."
                    });
                    return index.logger.error(err);
                }
                
                if (rows[0]) {
                    con.query(`DELETE from licenses WHERE license = ?`, [data.license], (err, rows) => {
                        if (err) {
                            res.status(500);
                            res.json({
                                message: "An error occured on the server."
                            });
                            return index.logger.error(err);
                        }

                        res.status(200)
                        res.json({
                            message: "deleted"
                        })
                    })
                } else {
                    res.status(200);
                    return res.json({
                        message: "Invalid key"
                    });
                }
            })
        })
    }

    listen(port, host) {
        return new Promise((resolve, reject) => {
            this.app.listen(port, host, (err) => {
                if (err) return reject(err)
                resolve();
            });
        })
    }

    escapeUnsafe(str = String) {
        str.replace(/ /g)
    }
}
module.exports = api;