const Mysql = require('mysql');
const Dotenv = require('dotenv');
Dotenv.config();

module.exports.dbMysql = class Database {
    constructor(config) {
        this.config = config;
        if (!this.config) {
            this.config = {
                host: process.env.BASE_MYSQL_HOST,
                user: process.env.BASE_MYSQL_USER,
                password: process.env.BASE_MYSQL_PASSWORD,
                database: process.env.BASE_MYSQL_DATABASE,
                port: process.env.BASE_MYSQL_PORT
            };
        }
        this.connection = Mysql.createConnection(this.config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
};
