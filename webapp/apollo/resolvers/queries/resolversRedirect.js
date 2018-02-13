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
  
    // get sql data...
    return sqlSchema.Users.find({
      where: {
        UserId: userId
      }
    }).then(function(result){
      return { 
        'userId': result.UserId, 
        'name': result.Name, 
        'email1':result.Email1, 
        'email2':result.Email2, 
        'phone1':result.Phone1, 
        'phone2':result.Phone2, 
        'yearOfBirth':result.YearOfBirth,
        'city':result.City,
        'gender':result.Gender,
        'ethnicity':result.Ethnicity
       };
    })
};

const usersStatisticsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'userId': userId, 'totalSteps': 11 }]);
  });
};

const initialRegisterQuery = (root, { name, email, source, sourceToken, code }) => {
  return services.getTokens(code)
  .then((tokens) => {
    return sqlSchema.Users.create({
      Name: name,
      Email1: email,
      AuthSource: source,
      AuthSourceToken: sourceToken,
      UserId: uuidv4(),
      GoogleFitToken: tokens.refresh_token
    })
    .then((result) => {
      return { 'userId' : result.UserId} ;
    })
    .catch((err) => {
      return err;
    });
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
