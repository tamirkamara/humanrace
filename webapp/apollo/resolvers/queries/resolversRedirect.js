var sqlSchema = require("../../../sqlSchemes");

// MOCK DATA, replace here with actual call to data source
const campaignQuery = (root, { id }) => {
  return new Promise((resolve, reject) => {
if (id) {
  resolve({'name': 'Collect steps campaign', 'id' : 3})
}
    resolve([{'name': 'Sunflower', 'id' : 1},
    {'name': 'HumanRace', 'id' : 2}]);
});
};

const campaignStatisticsQuery = (root, { name }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'steps' : 1 , 'goal' : 2 , user: {'name' : 'aaa', 'id' : 2}}]);
});
};

const usersQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve({'name' :'my user', 'id': 11});
});
};


const usersStatisticsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{'userId' : userId ,'totalSteps' : 11}]);
});
};

const initialRegisterQuery = (root, { name, email, source, sourceToken }) => {
  return new Promise((res, reject) => {
    try {
      sqlSchema.Users.create({
          Name: name,
          Email1: email,
          AuthSource: source,
          AuthSourceToken: sourceToken
      })
      return res('OK');
      }
      catch(err) {
          console.error('Error:' + err);
          return reject(err);
      }});
};

module.exports = {
  campaignQuery,
  campaignStatisticsQuery,
  usersQuery,
  usersStatisticsQuery,
  initialRegisterQuery,
};
