const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./typeDefs');

const graphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
    graphQLSchema,
};
