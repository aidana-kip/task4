const userRepository = require('../repositories/user-repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.saveUser = (req, res, next) => {
    console.log('Incoming request to save user: ' + req.body);
    userRepository.findByEmail(req.body.email.toString()).then((queryResult) => {
        if (queryResult.rows.length > 0) {
            res.status(400).send({
                message: 'User with such email already exists!'
            });
        } else {
            bcrypt.hash(req.body.password, 12).then((encryptedPassword) => {
                req.body.password = encryptedPassword;
                userRepository.save(req.body).then((queryResult) => {
                    queryResult.rows[0].password = '';
                    res.status(201).send(queryResult.rows[0]);
                })
                    .catch((err) => res.status(500).send(err));
            });
        }
    })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.login = (req, res, next) => {
    userRepository.findByEmail(req.body.email).then((queryResult) => {
        if (queryResult.rowCount > 0) {
            let user = queryResult.rows[0];
            bcrypt.compare(req.body.password, user.password).then((matchingResult) => {
                if (matchingResult) {
                    const token = jwt.sign({
                        id: user.id,
                        email: user.email
                    },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h"
                        });
                    userRepository.updateUserLoggedInTime(user.id);
                    res.send({ token: token, user: user });
                } else {
                    res.status(401).send({
                        message: 'Unauthorized!'
                    });
                }
            }).catch((err) => es.status(500).send(err));

        } else {
            res.status(400).send(
                {
                    message: 'User with such email does not exist or an account is blocked!'
                }
            );
        }
    })
        .catch((err) => res.status(500).send(err))
}

module.exports.getAllUsers = (req, res, next) => {
    userRepository.getAll().then((queryResult) => {
        queryResult.rows.forEach(el => el.password = null);
        res.send(queryResult.rows);
    })
        .catch((err) => res.status(500).send(err));
}

module.exports.getUser = (req, res, next) => {
    userRepository.getUser(req.params.id).then((queryResult) => {
        queryResult.rows[0].password = null;
        res.send(queryResult.rows[0]);
    })
        .catch((err) => res.status(500).send(err))
}

module.exports.deleteUsers = (req, res, next) => {
    const userIdsToDelete = req.body;
    userRepository.deleteUsers(userIdsToDelete).then((queryResult) => {
        res.status(204).send();
    }).catch((err) => res.status(500).send(err))
}

module.exports.blockUsers = (req, res, next) => {
    const userIdsToBlock = req.body;
    userRepository.blockUsers(userIdsToBlock).then((queryResult) => {
        res.send({ message: 'Updated!' });
    }).catch((err) => res.status(500).send(err));
}

module.exports.unblockUsers = (req, res, next) => {
    const userIdsToBlock = req.body;
    userRepository.unblockUsers(userIdsToBlock).then((queryResult) => {
        res.send({ message: 'Updated!' });
    }).catch((err) => res.status(500).send(err));
}