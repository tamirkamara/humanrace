// todo: this could be extracted to a module shared between client and server

const typeDefs = `

type Query {
  campaign(id: Int): Campaign,
  campaigns: [Campaign],
  campaignStatistics(campaignId: Int): [CampaignStatistics],
  usersStatistics(userId: String): [UserStatistics],
  user(userId: String): User
}

type Campaign {
  name: String
  id: Int
}

type CampaignStatistics {
  CampaignId: String,
  MetricId: Int,
  Day: String,
  TotalPerDay: Int
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

type Mutation {
  initialRegister(name: String!, email: String, source: String, sourceToken: String, code: String!): InitialRegisterResult,
  finishRegister(userId: String!, email2: String, password: String!, yearOfBirth: Int, phone1: String, phone2: String, city: String, gender: String, ethnicity: String): FinishRegisterResult,
}

type InitialRegisterResult {
  userId: String
}

type FinishRegisterResult {
  message: String
}

type UserInfo {
  userId: String,
  name: String,
  phone: String,
  email: String, 
  yearOfBirth: Int
}

`;

module.exports = {
  typeDefs,
};
