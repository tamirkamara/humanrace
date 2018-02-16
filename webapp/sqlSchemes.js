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
    Id: { type: Sequelize.INTEGER, primaryKey: true },
    Name: Sequelize.STRING(50),
    Sponsor: Sequelize.STRING(50),
    GoalMetricType: Sequelize.SMALLINT,
    GoalMetricValue: Sequelize.FLOAT(53),
    ImageUrl: Sequelize.STRING(2000),
    EndDate: Sequelize.DATE
},
    {
        timestamps: false,
    });

const UserActivities = sequelize.define('UserActivities', {
    UserId: { type: Sequelize.UUIDV4, primaryKey: true },
    MetricId: { type: Sequelize.STRING(20), primaryKey: true },
    StartTime: { type: Sequelize.TIME, primaryKey: true },
    EndTime: Sequelize.TIME,
    MetricValue: Sequelize.INTEGER
},
    {
        timestamps: false,
    });

const Users = sequelize.define('Users', {
    UserId: { type: Sequelize.UUIDV4, primaryKey: true },
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
    AuthSourceToken: Sequelize.STRING(2000),
    LastActivitySync: Sequelize.STRING(2000)
},
    {
        timestamps: false,
    });

const UsersInCampaigns = sequelize.define('UsersInCampaigns', {
    CampaignId: { type: Sequelize.INTEGER, allowNull: false },
    UserId: { type: Sequelize.UUIDV4, allowNull: false },
    StartDate: { type: Sequelize.TIME, allowNull: false },
    EndDate: Sequelize.TIME
},
    {
        timestamps: false,
    });

const UsersInCampaignsFullInfo = sequelize.define('vUsersInCampaignsFullInfo', {
        CampaignId: { type: Sequelize.INTEGER, allowNull: false },
        UserId: { type: Sequelize.UUIDV4, allowNull: false },
        StartDate: { type: Sequelize.TIME, allowNull: false },
        EndDate: Sequelize.TIME,
        GoalMetricType: Sequelize.SMALLINT
    },
        {
            timestamps: false,
        });

const CampaignStats = sequelize.define('vCampaignStats', {
    CampaignId: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
    MetricId: { type: Sequelize.INTEGER, allowNull: false },
    Day: Sequelize.DATE,
    TotalPerDay: { type: Sequelize.DATE, allowNull: false },
},
    {
        timestamps: false,
    });

const UserStats = sequelize.define('vUserStats', {
    UserId: { type: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
    Day: { type: Sequelize.DATE, allowNull: false },
    MetricId: { type: Sequelize.INTEGER, allowNull: false },
    TotalPerDay: { type: Sequelize.DATE },
},
    {
        timestamps: false,
    });

module.exports = {
    Users,
    UserActivities,
    Campaigns,
    UsersInCampaigns,
    UsersInCampaignsFullInfo,
    CampaignStats,
    UserStats
}