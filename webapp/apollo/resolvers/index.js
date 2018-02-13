const { campaignQuery, campaignStatisticsQuery, usersQuery, usersStatisticsQuery } = require('./queries/resolversRedirect.js');
const { initialRegisterQuery } = require('./queries/resolversRedirect.js');

const resolvers = {
  Query: {
    campaign: campaignQuery,
    campaigns: campaignQuery,
    campaignStatistics: campaignStatisticsQuery,
    user: usersQuery,
    usersStatistics: usersStatisticsQuery,
  },
  Mutation: {
    initialRegister: initialRegisterQuery,
  }
};

module.exports = {
  resolvers,
};
