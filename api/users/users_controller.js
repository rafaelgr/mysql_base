"use strict";
const Express = require('express');
var router = Express.Router();
const UsersMySql = require('./users_mysql');

router.get('/', (req, res) => {
    UsersMySql.getUsers()
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    UsersMySql.getUser(id)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
    UsersMySql.loginUser(req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.post('/', (req, res, next) => {
    UsersMySql.postUser(req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.put('/', (req, res, next) => {
    UsersMySql.putUser(req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    UsersMySql.deleteUser(id)
        .then(result => res.json(result))
        .catch(err => next(err));
});




module.exports = router;