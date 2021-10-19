const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const bcrypt = require("bcrypt");

const port = process.env.PORT || 6006;      // Set Port
const app = express();                      // Use Express
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.text());
app.use(express.urlencoded({extended: true}));


// Render Homepage
app.get('/', (request, response) => {
    console.log('Hello Home!');
    response.sendFile(__dirname + '/public/index.html');
});

// Serve Users Json
app.get('/json', function (req, res) {
    fs.readFile('public/js/users.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            res.send(obj);
        }
    });
});

// Handle User Login
app.post('/login', function (req, res) {
    var user = req.body['user'];
    var pass = req.body['password'];
    console.log(req.body);
    fs.readFile('public/js/users.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            if (user in obj) {
                console.log('User Found', pass, obj[user].password);
                const validPassword = await bcrypt.compare(pass, obj[user].password);
                if (validPassword) {
                    obj[user]['currUser'] = true;
                    var json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile('public/js/users.json', json, 'utf8', function writeFileCallback() {
                    });
                    console.log({message: "Valid password"});
                    res.send(true);
                } else {
                    console.log({error: "Invalid Password"});
                    res.send(false);
                }
            } else {
                res.send(false);
            }
        }
    });
});

// Handle User Signup
app.post('/signup', async function (req, res) {
    var user = req.body['user'];
    var pass = req.body['password'];
    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(pass, salt);
    console.log(req.body, password);

    fs.readFile('public/js/users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data);
            obj[user] = {user: user, password: password};
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/users.json', json, 'utf8', function writeFileCallback() {
            });
        }
    });
    res.send(true);
});

// Serve Static Files
app.use(express.static('public'));

// Listen to Port
app.listen(port, () => {
    console.log('Node Server running at : ', port)
    console.log(__dirname);
    console.log(('http://localhost:' + port))
});