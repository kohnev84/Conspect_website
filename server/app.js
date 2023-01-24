const cors = require('cors');
const pg = require('pg')
const express = require('express')
var bodyParser = require('body-parser')
const app = express()


app.use(cors({
    origin: 'http://localhost:3000'
}))

const config = {
    user: 'postgres',
    database: 'question',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    res.send('Hello world')
})

app.get('/getquestion', function (req, res) {
    console.log('Запрос получен');

    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM questions order by id', function (err, result) {
            done();
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            console.log(result.rows)
            return res.status(200).json({ response: result.rows });
        })
    })
})

app.delete('/deletequestion', function (req, res) {
    console.log('Запрос на удаление');

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`DELETE FROM questions WHERE id = ${req.body.idDeleteQuestion}`, function (err, result) {
            done();
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            console.log(result.rows)
            return res.status(200).json({ response: result.rows })
        })
    })
})

app.post('/savequestion', function (req, res) {
    console.log(req.body)

    const { question, answer } = req.body;

    console.log(question, answer)
    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }


        client.query(`INSERT INTO questions(questions, answers) VALUES('${question}', '${answer}'); `, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            console.log(result.rows);
            res.status(200).json({ response: 'success' });
        })
    })


})

app.post('/saveeditquestion', function (req, res) {
    console.log(req.body)

    const { answer, id } = req.body;

    console.log(id, answer)
    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }


        client.query(`UPDATE questions SET answers='${answer}' WHERE id=${id};
         `, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            console.log(result.rows);
            res.status(200).json({ response: result.rows });
        })
    })
})

app.listen(5000, console.log('Server Work'))