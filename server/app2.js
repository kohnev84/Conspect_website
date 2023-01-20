
var pg = require('pg');
var bodyParser = require('body-parser');
const path = require('path');

const config = {
    user: 'postgres',
    database: 'question',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config);



pool.connect(function (err, client, done) {

    if (err) {
        console.log("Can not connect to the DB" + err);
    }
    client.query('SELECT * FROM questions', function (err, result) {
        done();
        if (err) {
            console.log(err);
        }
        console.log(result.rows);
        pool.end()
    })
})
