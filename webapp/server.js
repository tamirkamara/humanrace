//var https = require('https');
var http = require('http');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var validate = require('jsonschema').validate;

var schema = require('./api/schema');
var sevices = require('./services');
var sqlSchemes = require('./sqlSchemes');
const { graphQLSchema } = require('./apollo/schema');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

var app = express();
var serverOptions = {};
//var port = 443;
var users = {};

const PORT = process.env.PORT || 4000;

//serverOptions.cert = fs.readFileSync('./cert/server.crt');
//serverOptions.key = fs.readFileSync('./cert/server.key');

//https.createServer(serverOptions, app).listen(PORT, err => {
http.createServer(app).listen(PORT, err => {
    if (err) return console.error(err);
    console.info(`server is listening on port ${PORT}`);
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
    return res.end(`Server is running!!!`);
});

// complex data structure are returned via graphql query language:
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));
// graphiql is easy to use IDE for quering the server. use http(s)://server/graphiql
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// simple GET commands:

//https://localhost/getTokens?clientid=291887666877-tfmttdff0s84jukc9nqsutdinn1s73hd.apps.googleusercontent.com&clientsecret=LQQl6TDX9oW2To9afvg9IS8O&code=4/AABj572xOc2n_BCzb1qe0xiQWSYjwQ3aWvSM7ir5g7NiyTqcHcur0eCR-vXqWoNehF0s4rTjnOJB3mz0vlA1-rw#
app.get('/getTokensApi', async (req, res) => {
    try {
        sevices.getTokensApi(req.query.clientid, req.query.clientsecret, req.query.code);
        return res.send('OK');
    }
    catch (err) {
        console.error('Error:' + err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error.', err });
    }
});

app.get('/getTokens', async (req, res) => {
    try {
        sevices.getTokens(req.query.clientid, req.query.clientsecret, req.query.code);
        return res.send('OK');
    }
    catch (err) {
        console.error('Error:' + err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error.', err });
    }
});

// POST commands
/*
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
*/

process.on('uncaughtException', err => {
    console.error(`uncaught exception: ${err.message}`);
    setTimeout(() => process.exit(1), 1000);
});
