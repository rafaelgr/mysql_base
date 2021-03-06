const Mysql = require('mysql');
const MysqlConnector = require('../../connectors/mysql_connector');
const Password = require("../../utilities/password");
const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');
Dotenv.config();

const userMysql = {
    getUsers: () => {
        return new Promise((resolve, reject) => {
            let db = new MysqlConnector.dbMysql();
            let sql = "SELECT * FROM users";
            db.query(sql)
                .then(rows => { db.close(); resolve(rows) })
                .catch(err => { db.close(); reject(err); });
        });
    },
    getUser: (id) => {
        return new Promise((resolve, reject) => {
            let db = new MysqlConnector.dbMysql();
            let sql = "SELECT * FROM users WHERE userId = ?";
            sql = Mysql.format(sql, id);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) return reject({ status: 404, message: `No user found for id ${id}` });
                    let user = rows[0];
                    delete user.password;
                    resolve(user);
                })
                .catch(err => { db.close(); reject(err); });
        });
    },
    loginUser: (obj) => {
        return new Promise((resolve, reject) => {
            let user = null;
            let db = new MysqlConnector.dbMysql();
            let sql = "SELECT * FROM users WHERE email = ?";
            sql = Mysql.format(sql, obj.email);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) return reject({ status: 401, message: `Auth failed` });
                    user = rows[0];
                    var result = Password.validate(user.password, obj.password);
                    if (!result) return reject({ status: 401, message: `Auth failed` });
                    let token = Jwt.sign({
                        email: user.email,
                        userId: user.userId
                    },
                        process.env.BASE_JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                    resolve({ email: user.email, token: token });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },
    postUser: (obj) => {
        obj.userId = 0;
        return new Promise((resolve, reject) => {
            let db = new MysqlConnector.dbMysql();
            let sql = "";
            sql = Mysql.format("SELECT * FROM users WHERE email = ?", obj.email);
            db.query(sql)
                .then(results => {
                    if (results.length > 0) {
                        return reject({ status: 409, message: `Email ${obj.email} in use` });
                    };
                    let hash = Password.hash(obj.password);
                    obj.password = hash;
                    sql = Mysql.format("INSERT INTO users SET ?", obj);
                    return db.query(sql);
                })
                .then(result => {
                    db.close();
                    obj.userId = result.insertId;
                    resolve(obj);
                })
                .catch(err => {
                    db.close();
                    reject(err);
                });
        });
    },
    putUser: (obj) => {
        let id = obj.userId;
        return new Promise((resolve, reject) => {
            let db = new MysqlConnector.dbMysql();
            let sql = "";
            let hash = Password.hash(obj.password);
            obj.password = hash;
            sql = Mysql.format("UPDATE users SET ? WHERE userId = ?", [obj, id]);
            db.query(sql)
                .then(() => { db.close(); resolve(obj); })
                .catch(err => { db.close(); reject(err); });
        });
    },
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            let db = new MysqlConnector.dbMysql();
            let sql = "";
            sql = Mysql.format("DELETE FROM users WHERE userId = ?", id);
            db.query(sql)
                .then(() => { db.close(); resolve({ res: 'OK' }); })
                .catch(err => { db.close(); reject(err); });
        });
    }
};
module.exports = userMysql;