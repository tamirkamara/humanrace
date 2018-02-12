// todo: this could be extracted to a module shared between client and server

const typeDefs = `

type Query {
  campaign(name: String): [Campaign],
  statistics(userId: Int): [Statistics],
}

type Campaign {
  name: String
  id: Int
}

type Statistics {
  campaign: Campaign,
  steps: Int,
}

`;

module.exports = {
  typeDefs,
};
