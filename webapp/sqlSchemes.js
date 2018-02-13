const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env["sqldatabase"], process.env["sqluser"], process.env["sqlpassword"], {
    host: process.env["sqlhost"],
    dialect: 'mssql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    encrypt: true
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const Campaigns = sequelize.define('Campaigns', {
  Id: Sequelize.INTEGER,
  Name: Sequelize.STRING(50),
  Sponser: Sequelize.STRING(50),
  GoalMetricType: Sequelize.SMALLINT,
  GoalMetricValue: Sequelize.FLOAT(53)
},
{
    timestamps: false,
});

const UserActivities = sequelize.define('UserActivities', {
    UserId: Sequelize.UUIDV4,
    MetricType: Sequelize.STRING(20),
    StartTime: Sequelize.DATE,
    EndTime: Sequelize.DATE,
    MetricValue: Sequelize.INTEGER
},
{
    timestamps: false,
});

const Users = sequelize.define('Users', {
    UserId: Sequelize.UUIDV4,
    Name: Sequelize.STRING(50),
    Email1: Sequelize.STRING(50), 
    Email2: Sequelize.STRING(50),
    Password: Sequelize.STRING(200),
    YearOfBirth: Sequelize.INTEGER,
    Phone1: Sequelize.STRING(20),
    Phone2: Sequelize.STRING(20),
    City: Sequelize.STRING(50),
    Gender: Sequelize.STRING(6),
    Ethnicity: Sequelize.STRING(50),
    AuthSource: Sequelize.STRING(50),
    GoogleFitToken: Sequelize.STRING(2000),
    AuthSourceToken: Sequelize.STRING(2000)
},
{
    timestamps: false,
});

const UsersInCampaigns = sequelize.define('Users', { 
    CapaignId: {type: Sequelize.INTEGER, allowNull: false},
    UserId: {type: Sequelize.UUIDV4, allowNull: false},
    JoinDate: Sequelize.DATE
},
{
    timestamps: false,
});

module.exports = {
    Users,
    UserActivities,
    Campaigns,
    UsersInCampaigns
}