const typeDefs = `

type Query {
  campaign(id: Int): Campaign,
  campaigns: [Campaign],
  campaignStatistics(campaignId: Int): [CampaignStatistics],
  usersStatistics(userId: String): [UserStatistics],
  user(userId: String): UserInfo
}

type Campaign {
  id: Int
  name: String,
  sponsor: String
  goalMetricType: Int
  goalMetricValue: Float
  imageUrl: String
  endDate: String
}

type CampaignStatistics {
  CampaignId: String,
  MetricId: Int,
  Day: String,
  TotalPerDay: Int
}

type UserStatistics {
  UserId: String,
  MetricId: Int,
  Day: String,
  TotalPerDay: Int
}

input ActivityInput {
  dataSourceId: String,
  startTimeMillis: String,
  endTimeMillis: String,
  val: Int
}

input ActivitiesInput {
  userId: String!,
  userActivities: [ActivityInput]
}

type Mutation {
  initialRegister(name: String!, email: String, source: String, sourceToken: String, code: String!): InitialRegisterResult,
  finishRegister(userId: String!, email2: String, password: String!, yearOfBirth: Int, phone1: String, phone2: String, city: String, gender: String, ethnicity: String): FinishRegisterResult,
  finishCampaignParticipation(userId: String!, campaignId: Int!, startDate: String!, endDate: String): finishCampaignParticipationResult,
  campaignParticipation(userId: String!, campaignId: Int!, startDate: String!, endDate: String): campaignParticipationResult,
  updateActivity(input: ActivitiesInput!): String
}

type InitialRegisterResult {
  userId: String
}

type FinishRegisterResult {
  message: String
}

type finishCampaignParticipationResult {
  message: String
}

type campaignParticipationResult {
  message: String
}

type UserInfo {
  userId: String,
  name: String,
  email1: String, 
  email2: String, 
  phone1: String,
  phone2: String,
  yearOfBirth: Int,
  city: String,
  gender: String,
  ethnicity: String
}

type UsersInCampaigns {
  CampaignId: Int,
  UserId: String,
  StartDate: String,
  EndDate: String
}

type UsersInCampaignsFullInfo {
  CampaignId: Int,
  UserId: String,
  StartDate: String,
  EndDate: String,
  GoalMetricType: String
}
`;

module.exports = {
  typeDefs,
};
