const db = require('../util/database');

module.exports.findByEmail = (email) => {
    return db.pool.query('select * from users where email = $1;', [email]);
}

module.exports.updateUserLoggedInTime = (id) => {
    return db.pool.query('update users set last_login_time=$2 where id=$1;', [id, new Date()]);
}

module.exports.save = (user) => {
    return db.pool.query('insert into users(name, email, password, last_login_time, registration_time, status)\
    values ($1, $2, $3, $4, $5, $6) returning *;',
        [user.name, user.email, user.password, null, new Date(), 'active']);
}

module.exports.getUser = (id) => {
    return db.pool.query('select * from users where id = $1;', [id]);
}

module.exports.getAll = () => {
    return db.pool.query('select * from users;');
}

module.exports.deleteUsers = (ids) => {
    return db.pool.query('delete from users where id in (' + ids + ');');
}

module.exports.blockUsers = (ids) => {
    return db.pool.query('update users set status=$1 where id in (' + ids + ');', ['blocked']);
}

module.exports.unblockUsers = (ids) => {
    return db.pool.query('update users set status=$1 where id in (' + ids + ');', ['active']);
}