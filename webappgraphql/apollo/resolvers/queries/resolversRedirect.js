
const campaignQuery = (root, { name }) => {
  return new Promise((resolve, reject) => {
    resolve([{'name': 'Sunflower', 'id' : 1},
    {'name': 'HumanRace', 'id' : 2}]);
});
};

const statsQuery = (root, { userId }) => {
  return new Promise((resolve, reject) => {
    resolve([{ 'steps' : 1}]);
});
};

module.exports = {
  campaignQuery,
  statsQuery,
};
