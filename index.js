// Require Packages
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const bcrypt = require("bcrypt");
const cors = require("cors");
const logger = require("morgan");


const {fork} = require('child_process');
const forked = fork('./child.js');

const port = process.env.PORT || 6006;      // Set Port
const app = express();                      // Use Express
app.use(express.json());


app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));     // User Body Parser
app.use(express.text());
app.use(express.urlencoded({extended: true}));

// JSON ↭ CSV Packages
const {Parser} = require('json2csv');
const csv2json = require('csvjson-csv2json');

app.get('/hi', (request, response) => {
    //console.log('Hello Home!');
    response.send("HIIIIIIIIIII");
});

// Serve Users Json
app.get('/json', function (req, res) {
    fs.readFile('public/js/users.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            res.send(obj);
        }
    });
});

// Fetch Current User Data
app.get('/userdata', function (req, res) {
    fs.readFile('public/js/current.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            res.send(obj['currUser']);
        }
    });
});

// Handle Export Request
app.get('/export', function (req, res) {
    fs.readFile('public/js/current.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var tmp = [];
            var tjs = {};
            var obj = JSON.parse(data);
            var myData = obj['currUser']['logs'];
            var xt = {user: obj['currUser']['user']};
            Object.assign(tjs, xt)
            tmp.push(tjs);
            for (var key in myData) {
                tjs = myData[key];
                tmp.push(tjs);
            }
            //console.log(tmp);
            try {
                const parser = new Parser({});
                const csv = parser.parse(tmp);
                res.send(csv);
            } catch (err) {
                console.error(err);
            }
        }
    });
});

// Handle Import Request
app.post('/import', function (req, res) {
    //console.log(req.body);
    var mycsv = req.body;
    const json = csv2json(mycsv, {parseNumbers: true});
    //console.log(json);
    res.send(json);
});

/**
 * @desc To update Current User
 * @param user {String} Username
 * @param usrdata {JSON} User Data
 */
function user_login(user, usrdata) {
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            obj["currUser"] = Object.assign({currUser: true, user: user}, usrdata);
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function writeFileCallback() {
            });
            //console.log({message: "Current User Updated"});
        }
    });

}

// Handle User Login
app.post('/login', function (req, res) {
    var user = req.body['user'];
    var pass = req.body['password'];
    //console.log(req.body);
    fs.readFile('public/js/users.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            if (user in obj) {
                //console.log('User Found', pass, obj[user].password);
                const validPassword = await bcrypt.compare(pass, obj[user].password);
                if (validPassword) {
                    obj[user]['currUser'] = true;
                    var json = JSON.stringify(obj);
                    fs.writeFile('public/js/users.json', json, 'utf8', function writeFileCallback() {
                    });
                    //console.log({message: "Valid password"});
                    user_login(user, obj[user]['userdata']);
                    res.send(true);
                } else {
                    //console.log({error: "Invalid Password"});
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
    //console.log(req.body, password);

    fs.readFile('public/js/users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            obj[user] = {user: user, password: password, currUser: false, userdata: {logs: {}}};
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/users.json', json, 'utf8', function writeFileCallback() {
            });
            user_login(user, obj[user]['userdata']);
        }
    });
    res.send(true);
});

// Handle User Logout
app.get('/logout', function (req, res) {
    fs.readFile('public/js/current.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            //console.log(err);
        } else {
            var obj = JSON.parse(data);
            var curruser = obj["currUser"]['user'];
            //console.log(obj);
            fs.readFile('public/js/users.json', 'utf8', function readFileCallback(err, data) {
                var obj1 = JSON.parse(data);
                obj1[curruser]['currUser'] = false;
                obj1[curruser]['userdata'] = Object.assign(obj["currUser"]);
                var json1 = JSON.stringify(obj1);
                fs.writeFile('public/js/users.json', json1, 'utf8', function writeFileCallback() {
                });
            });
            var json = JSON.stringify(obj);
            fs.writeFile('public/js/current.json', json, 'utf8', function () {
            });
            //console.log({message: "Current User Logged Out"});
            res.send(curruser);
        }
    });
});

// Creating New Task
app.post('/createnew', (request, response) => {
    const forked = fork('./child.js');
    var data = (request.body);
    //console.log("To new", data);
    forked.send({msg: "createnew", data: data});
    forked.on('message', (rmsg) => {
        //console.log(rmsg);
        response.send(true);
    });
});

// Editing Logs
app.post('/editlog', (request, response) => {
    const forked = fork('./child.js');
    var data = (request.body);
    //console.log("To Edit", data);
    forked.send({msg: "editlog", data: data});
    forked.on('message', (rmsg) => {
        //console.log(rmsg);
        response.send(true);
    });
});

// Deleting Logs
app.post('/deletelog', (request, response) => {
    const forked = fork('./child.js');
    var data = (request.body);
    //console.log("To Delete", data);
    forked.send({msg: "deletelog", data: data});
    forked.on('message', (rmsg) => {
        //console.log(rmsg);
        response.send(true);
    });
});

// Adding Logs
app.post('/addlog', (request, response) => {
    const forked = fork('./child.js');
    var data = (request.body);
    forked.send({msg: "addlog", data: data});
    forked.on('message', (rmsg) => {
        //console.log(rmsg);
        response.send(true);
    });
});


// Serve Static Files
app.use(express.static(__dirname + '/public'));

// Listen to Port
app.listen(port, () => {
    console.log('Node Back End Server running at : ', port);
    console.log(('http://localhost:' + port));
});