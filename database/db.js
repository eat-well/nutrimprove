const queries = require('./queries');
const mysql = require('mysql');
const { response } = require('./response');

const db_config = {
    connectionLimit: 50,
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    database: `${process.env.DATABASE}`,
    password: `${process.env.PASSWORD}`,
};
const mysql_pool  = mysql.createPool(db_config);

const statusCheck = (req, res) => this.connection(req, res);

const connection = (req, res, query) => mysql_pool.getConnection((err, conn) => {
    if (err) {
        response(res, err, 'Error connecting to database');
        return;
    }

    const runQuery = () => conn.query(query, (err2, rows) => {
        if (err2) {
            response(res, err2, 'Connection failed');
        } else {
            response(res, err2, rows);
        }
        conn.release();
    });

    conn.query(queries.statusCheck, (err2, rows) => {
        if (err2) {
            response(res, err2, 'Status check failed');
        } else {
            const val = rows[0] ? rows[0]['val'] : '';
            if (val === 'OK' ) {
                query ? runQuery() : response(res, err2, 'Status check successful');
            } else {
                response(res, 500, 'Database not ready');
                conn.release();
            }
        }
    });
});


module.exports.statusCheck = statusCheck;
module.exports.connection = connection;