var https = require('https');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var validate = require('jsonschema').validate;

var schema = require('./api/schema');
var sevices = require('./services')

var app = express();
var serverOptions = {};
var port = 443;
var users = {};

serverOptions.cert = fs.readFileSync('./cert/server.crt');
serverOptions.key = fs.readFileSync('./cert/server.key');

https.createServer(serverOptions, app).listen(port, err => {
    if (err) return console.error(err);
    console.info(`server is listening on port ${port}`);
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
	return res.end(`Server is running!!!`);
});

app.post('/userinfo', async (req, res) => {
    if (!validate(req.body, schema.userinfo.post).valid) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: `invalid schema - expected schema is ${util.inspect(schema.userinfo.post)}` });
    }

    if(req.body.userId){
        console.info('Received the following user info:' + JSON.stringify(req.body));
        users[req.body.userId] = req.body;
        return res.send('OK');
    }else{
        console.error('No userId found in the request body.');
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'No userId found in the request body.'});
    }
});


//https://localhost/getTokens?clientid=291887666877-tfmttdff0s84jukc9nqsutdinn1s73hd.apps.googleusercontent.com&clientsecret=LQQl6TDX9oW2To9afvg9IS8O&code=4/AABj572xOc2n_BCzb1qe0xiQWSYjwQ3aWvSM7ir5g7NiyTqcHcur0eCR-vXqWoNehF0s4rTjnOJB3mz0vlA1-rw#
app.get('/getTokensApi', async (req, res) => {
    try{
        sevices.getTokensApi(req.query.clientid,req.query.clientsecret,req.query.code);
        return res.send('OK');
    }
    catch(err) {
        console.error('Error:' + err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error.', err});
    }
});

app.get('/getTokens', async (req, res) => {
    try{
        sevices.getTokens(req.query.clientid,req.query.clientsecret,req.query.code);
        return res.send('OK');
    }
    catch(err) {
        console.error('Error:' + err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error.', err});
    }
});

process.on('uncaughtException', err => {
	console.error(`uncaught exception: ${err.message}`);
	setTimeout(() =>  process.exit(1), 1000);
});
