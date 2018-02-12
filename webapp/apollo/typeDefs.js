// todo: this could be extracted to a module shared between client and server

const typeDefs = `

type Query {
  campaign(id: Int): Campaign,
  campaigns: [Campaign],
  campaignStatistics(campaignId: Int): [CampaignStatistics],
  usersStatistics(userId: Int): [UserStatistics],
  user(userId: Int): User
}

type Campaign {
  name: String
  id: Int
}

type CampaignStatistics {
  campaign: Campaign,
  steps: Int,
  goal:Int,
  percentageCompleted: Int,
}

type UserStatistics {
  user: User,
  totalSteps: Int,
  numberOfCampaigns:Int,
}

type User {
  name: String,
  id: Int,
  Campaigns: [Campaign],
}

`;

module.exports = {
  typeDefs,
};
