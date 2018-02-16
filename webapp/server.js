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
const cors = require('cors');

var app = express();
app.use(cors());
var serverOptions = {};

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

process.on('uncaughtException', err => {
    console.error(`uncaught exception: ${err.message}`);
    setTimeout(() => process.exit(1), 1000);
});
