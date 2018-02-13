var sqlSchema = require("../../../sqlSchemes");
const uuidv4 = require('uuid/v4');
const services = require('../../../services');

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

const initialRegisterQuery = (root, { name, email, source, sourceToken, clientId, clientSecret, code }) => {
    return sqlSchema.Users.create({
      Name: name,
      Email1: email,
      AuthSource: source,
      AuthSourceToken: sourceToken,
      UserId: uuidv4()
    })
    .then(function (result) {
      // we have a user, lets get the tokens
      services.getTokens(clientId, clientSecret, code)
        .then((tokens => {
          sqlSchema.Users.update({
            GoogleFitToken: tokens.refresh_token
          }, 
          {
            where: {
              UserId: result.userId
            }
          })
        }));
      
        // dont wait on the get tokens and update command...
      return { 'userId' : result.userId} ;
    })
    .catch((err) => {
      return err;
    });
};

const finishRegisterQuery = (root, {userId, email2, password, yearOfBirth, phone1, phone2, city, gender, ethnicity}) => {
  try {
    return sqlSchema.Users.update({
      Email2: email2,
      Password: password,
      YearOfBirth: yearOfBirth,
      Phone1: phone1,
      Phone2: phone2,
      City: city,
      Gender: gender,
      Ethnicity: ethnicity
    }, {
      where: {
        UserId: userId
      } }
     ).then(function (result) {
      return { 'message' : 'OK'} ;
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
}

module.exports = {
  campaignQuery,
  campaignStatisticsQuery,
  usersQuery,
  usersStatisticsQuery,
  initialRegisterQuery,
  finishRegisterQuery,
};
