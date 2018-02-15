const { campaignQuery, campaignsQuery, campaignStatisticsQuery, usersQuery, usersStatisticsQuery} = require('./queries/resolversRedirect.js');
const { initialRegisterQuery, finishRegisterQuery, updateActivityQuery, finishCampaignParticipationQuery, campaignParticipationQuery} = require('./queries/resolversRedirect.js');

const resolvers = {
  Query: {
    campaign: campaignQuery,
    campaigns: campaignsQuery,
    campaignStatistics: campaignStatisticsQuery,
    user: usersQuery,
    usersStatistics: usersStatisticsQuery
  },
  Mutation: {
    initialRegister: initialRegisterQuery,
    finishRegister: finishRegisterQuery,
    finishCampaignParticipation: finishCampaignParticipationQuery,
    campaignParticipation: campaignParticipationQuery,
    updateActivity: updateActivityQuery,
  }
};

module.exports = {
  resolvers
};
