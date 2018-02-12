const { campaignQuery, campaignStatisticsQuery, usersQuery, usersStatisticsQuery } = require('./queries/resolversRedirect.js');

const resolvers = {
  Query: {
    campaign: campaignQuery,
    campaigns: campaignQuery,
    campaignStatistics: campaignStatisticsQuery,
    user: usersQuery,
    usersStatistics: usersStatisticsQuery,
  },
};

module.exports = {
  resolvers,
};
