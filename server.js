const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const bcrypt = require("bcrypt");
const cors = require("cors");
const logger = require("morgan");

const port = process.env.PORT || 6060;      // Set Port
const app = express();                      // Use Express
app.use(express.json());

//app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.text());
app.use(express.urlencoded({extended: true}));


app.get('/hi', (request, response) => {
    console.log('Hello Home!');
    response.send("HIIIIIIIIIII");
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

// Serve Static Files
app.use(express.static(__dirname + '/public'));

// Listen to Port
app.listen(port, () => {
    console.log('Node Front End Server running at : ', port);
    console.log(('http://localhost:' + port));
});