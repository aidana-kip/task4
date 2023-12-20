const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const adminController = require('../controllers/admin-controller');

const authMiddleware = (req, res, next) => {
    if (req.headers['access-token']) {
        const token = req.headers['access-token']

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).send({
                message: 'Unauthorized!'
            });
        }
    } else {
        res.status(401).send({
            message: 'Unauthorized!'
        })
    }
}

router.get('/users', authMiddleware, adminController.getAllUsers);
router.post('/users/login', adminController.login);
router.post('/users', adminController.saveUser)
router.get('/users/:id', authMiddleware, adminController.getUser)
router.post('/users/batch-delete', authMiddleware, adminController.deleteUsers);
router.put('/users/block/batch', authMiddleware, adminController.blockUsers);
router.put('/users/unblock/batch', authMiddleware, adminController.unblockUsers);

module.exports = router;