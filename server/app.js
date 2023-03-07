const cors = require('cors');
const path = require('path');
const pg = require('pg')
const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs');
var http = require('http');
const multer = require('multer')
const app = express()

app.use(express.static(path.join('../client', 'build')));

app.use(cors({
    origin: '*'
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

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        console.log(req.body)
        cb(null, req.body.some + "_" + Date.now() + '_' + Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("avatar");

// app.post("/upload", async (req, res) => {
//     console.log(req.body)
//     console.log(req.file)
//     upload(req, res, (err) => {
//         console.log("Request ---", req.body.some);
//         console.log("Request --- some", req.some);

//         console.log("Request file ---", req.file);
//         if (!err)
//             return res.status(200).json({ response: 21 });
//     });
// })

app.get('/download', function (req, res) {
    const file = `${__dirname}/uploads/9908e81ade0aa99e29c35eacd0de5254.txt`;
    res.download(file);
});

app.get('/', function (req, res) {
    res.send('Hello world')
})

app.get('/getquestion', function (req, res) {
    console.log('Запрос получен');

    pool.connect(function (err, client, done) {
        console.log('Проверка бэка номер 1')
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM questions order by id', function (err, result) {
            done();
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            // console.log(result.rows)
            console.log('Проверка бэка номер 2')
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
        client.query(`DELETE FROM questions WHERE id='${req.body.idDeleteQuestion}';`, function (err, result) {
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
    console.log(req.file)

    upload(req, res, (err) => {
        console.log("Request --- some", req.some);

        console.log("Request file ---", req.file);//Here you get file.
        /*Now do where ever you want to do*/
    });

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