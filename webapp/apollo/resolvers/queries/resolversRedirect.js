var sqlSchema = require("../../../sqlSchemes");
const uuidv4 = require('uuid/v4');

// MOCK DATA, replace here with actual call to data source
const campaignQuery = (root, { id }) => {
  return new Promise((resolve, reject) => {
    if (id) {
      resolve({ 'name': 'Collect steps campaign', 'id': 3 })
    }
    resolve([{ 'name': 'Sunflower', 'id': 1 },
    { 'name': 'HumanRace', 'id': 2 }]);
  });
};

const campaignStatisticsQuery = (root, { name }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'steps': 1, 'goal': 2, user: { 'name': 'aaa', 'id': 2 } }]);
  });
};

const usersQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve({ 'name': 'my user', 'id': 11 });
  });
};


const usersStatisticsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'userId': userId, 'totalSteps': 11 }]);
  });
};

const initialRegisterQuery = (root, { name, email, source, sourceToken }) => {
  try {
    return sqlSchema.Users.create({
      Name: name,
      Email1: email,
      AuthSource: source,
      AuthSourceToken: sourceToken,
      UserId: uuidv4()
    }).then(function (result) {
      return { 'userId' : result.UserId} ;
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
};

module.exports = {
  campaignQuery,
  campaignStatisticsQuery,
  usersQuery,
  usersStatisticsQuery,
  initialRegisterQuery,
};
