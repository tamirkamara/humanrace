const sqlSchema = require("../../../sqlSchemes");
const uuidv4 = require('uuid/v4');
const services = require('../../../services');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
var MetricType = {"steps": 1, "distance": 2}

const getMetricId = (str) => {
  if (str.includes("step_count")) {
    return MetricType.steps;
  }
  
  return MetricType.distance;
}

const campaignQuery = (root, { id }) => {
  try{
    return sqlSchema.Campaigns.find({
      where: {
        Id: id
      }
    }).then(function(result){
      return { 
        'id': result.Id, 
        'name': result.Name, 
        'sponsor':result.Sponsor, 
        'goalMetricType':result.GoalMetricType, 
        'goalMetricValue':result.GoalMetricValue, 
        'imageUrl':result.ImageUrl, 
        'endDate':result.EndDate
      };
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
};

const campaignsQuery = (root, {}) => {
  try{
    return sqlSchema.Campaigns.findAll()
    .then(function(result){
      var campaigns = [];
      for(var i in result){
        campaigns.push({
          'id': result[i].Id, 
          'name': result[i].Name, 
          'sponsor':result[i].Sponsor, 
          'goalMetricType':result[i].GoalMetricType, 
          'goalMetricValue':result[i].GoalMetricValue, 
          'imageUrl':result[i].ImageUrl, 
          'endDate':result[i].EndDate
        });
      }
      return campaigns;
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
}

const campaignStatisticsQuery = (root, { campaignId }) => {
    try {
       return sqlSchema.CampaignStats.findAll(
        {
          where: {
            CampaignId: campaignId
          }
        }
      ).then(function(result) {
        return JSON.parse(JSON.stringify(result));     
      })
    }
    catch (err) {
      console.error('Error:' + err);
      return err;
    }
};

const usersQuery = (root, { userId }) => {
  try{
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
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
};

const usersStatisticsQuery = (root, { userId }) => {
  try {
    return sqlSchema.UserStats.findAll(
     {
       where: {
         UserId: userId
       }
     }
   ).then(function(result) {
     return JSON.parse(JSON.stringify(result));     
   })
 }
 catch (err) {
   console.error('Error:' + err);
   return err;
 }
};

// to utilize the 'code' param which for now is disabled, uncomment (all of) the following commented out 
// lines, this will go to google and get the refresh token using the code and save it into
// SQL.
const initialRegisterQuery = (root, { name, email, source, sourceToken, code }) => {
  //return services.getTokens(code)
  //.then((tokens) => {
    return sqlSchema.Users.create({
      Name: name,
      Email1: email,
      AuthSource: source,
      AuthSourceToken: sourceToken,
      UserId: uuidv4(),
      GoogleFitToken: 'tbd token' //tokens.refresh_token
    })
    .then((result) => {
      return { 'userId' : result.UserId} ;
    })
    .catch((err) => {
      return err;
    });
  //})
  //.catch((err) => {
  //  err.message = "Failed getting google refresh token: " + err.message;
  //  return err;
  //});
};

const finishRegisterQuery = (root, { userId, email2, password, yearOfBirth, phone1, phone2, city, gender, ethnicity }) => {
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
        }
      }
    ).then(function (result) {
      return { 'message': 'OK' };
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
}

const finishCampaignParticipationQuery = (root, {userId, campaignId, endDate}) => {
  try {
    return sqlSchema.UsersInCampaigns.update({
      EndDate: endDate
    },{
      where: {
        UserId: userId,
        CampaignId: campaignId,
        EndDate: {
          [Op.or]:{
            [Op.eq]: null,
            [Op.gt]: endDate
          }
        }
      }
    }).then(function (result) {
      return { 'message': 'OK' };
    })
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
}

const campaignParticipationQuery = (root, {userId, campaignId, startDate, endDate}) => {
  try {
    sqlSchema.UsersInCampaigns.create({
      CampaignId: campaignId,
      UserId: userId,
      StartDate: startDate,
      EndDate: endDate
    }).then((result) => {
      return { 'message' : 'OK'} ;
    })
    .catch((err) => {
      return err;
    });
  }
  catch (err) {
    console.error('Error:' + err);
    return err;
  }
}

const updateActivityQuery = (root, { input }) => {
  console.log(input);
  var promises = [];
  if (input.userActivities!= null && input.userActivities.length > 0) {
    promises = input.userActivities.map(function (activity) {
      return sqlSchema.UserActivities.create({
        UserId: input.userId,
        MetricId: getMetricId(activity.dataSourceId),
        StartTime: new Date(Number(activity.startTimeMillis)).toISOString(),
        EndTime: new Date(Number(activity.endTimeMillis)).toISOString(),
        MetricValue: activity.val
      });
    });
  }

  return Promise.all(promises)
    .then(function () {
      //  return Promise.resolve(result);
      return sqlSchema.Users.update({
        LastActivitySync: new Date(Date.now()).toISOString(),
      }, {
          where: {
            UserId: input.userId
          }
        });
    }).then(() => {
      return "done";
    })
    .catch((err) =>{
      return err;
    });
}

module.exports = {
  campaignQuery,
  campaignsQuery,
  campaignStatisticsQuery,
  usersQuery,
  usersStatisticsQuery,
  initialRegisterQuery,
  finishRegisterQuery,
  finishCampaignParticipationQuery,
  campaignParticipationQuery,
  updateActivityQuery
};
