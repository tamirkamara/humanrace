const express = require('express');
const bodyParser = require('body-parser');
const { graphQLSchema } = require('./apollo/schema');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: graphQLSchema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});