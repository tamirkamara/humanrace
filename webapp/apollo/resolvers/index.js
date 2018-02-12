const { campaignQuery, statsQuery } = require('./queries/resolversRedirect.js');

const resolvers = {
  Query: {
    campaign: campaignQuery,
    statistics: statsQuery,
  },
};

module.exports = {
  resolvers,
};
