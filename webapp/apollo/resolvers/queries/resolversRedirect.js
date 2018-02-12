
// MOCK DATA, replace here with actual call to data source
const campaignQuery = (root, { id }) => {
  return new Promise((resolve, reject) => {
if (id) {
  resolve({'name': 'AA', 'id' : 3})
}
    resolve([{'name': 'Sunflower', 'id' : 1},
    {'name': 'HumanRace', 'id' : 2}]);
});
};

const campaignStatisticsQuery = (root, { name }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'steps' : 1 , 'goal' : 2 }]);
});
};
/*
const statsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'steps' : 1 , 'goal' : 2, 'percentageCompleted': 50, 'campaign' : {'name': 'HumanRace', 'id' : 2}}]);
});
};*/  


const usersQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve({'name' :'my user', 'id': 11});
});
};


const usersStatisticsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{'totalSteps' : 11}]);
});
};



module.exports = {
  campaignQuery,
  campaignStatisticsQuery,
  //statsQuery,
  usersQuery,
  usersStatisticsQuery,
};
