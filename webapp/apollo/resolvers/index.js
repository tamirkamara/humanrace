const { campaignQuery, campaignsQuery, campaignStatisticsQuery, usersQuery, usersStatisticsQuery } = require('./queries/resolversRedirect.js');
const { initialRegisterQuery, finishRegisterQuery, updateActivityQuery } = require('./queries/resolversRedirect.js');

const resolvers = {
  Query: {
    campaign: campaignQuery,
    campaigns: campaignsQuery,
    campaignStatistics: campaignStatisticsQuery,
    user: usersQuery,
    usersStatistics: usersStatisticsQuery,
  },
  Mutation: {
    initialRegister: initialRegisterQuery,
    finishRegister: finishRegisterQuery,
    updateActivity: updateActivityQuery,
  }
};

module.exports = {
  resolvers,
};
