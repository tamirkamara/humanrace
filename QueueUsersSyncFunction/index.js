module.exports = function (context, myTimer) {

    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('JavaScript is running late!');
    }

    context.bindings.outputQueueItem = [];

    getUsers(context).then(function () {
        context.log('JavaScript timer trigger function ran!', timeStamp);
        context.done();
    });
}

function getUsers(context) {
    return new Promise((res, rej) => {

        var Connection = require('tedious').Connection;

        var config = {
            userName: process.env['sql_username'],
            password: process.env['sql_password'],
            server: process.env['sql_host'],

            // If you're on Windows Azure, you will need this:
            options: {
                encrypt: true,
                database: process.env['sql_database']
            },
        };

        var connection = new Connection(config);

        connection.on('connect', function (err) {
            // If no error, then good to go...
            executeStatement();
        });


        var Request = require('tedious').Request;

        function executeStatement() {
            request = new Request("SELECT UserId, LastActivitySync, GoogleFitToken FROM Users WHERE ISNULL(GoogleFitToken, 'tbd token') <> 'tbd token'", function (err, rowCount) {
                if (err) {
                    context.log(err);
                    rej(err);
                } else {
                    context.log(rowCount + ' rows');
                    res();
                }
            });

            request.on('row', function (columns) {
                var userId = columns[0].value;
                var lastActivitySync = Date.parse(columns[1].value);
                var googleFitRefreshToken = columns[2].value

                context.log('User Id: ' + userId + 'Last Sync: ' + lastActivitySync);

                var myObject = {};
                myObject.userId = userId;

                if (isNaN(lastActivitySync)) {
                    var date = new Date();
                    date.setDate(date.getDate() - 1);
                    date.setHours(0,0,0,0);
                    myObject.startTime = Date.parse(date);
                } else {
                    myObject.startTime = lastActivitySync;
                }

                var bucketTime = parseInt(process.env['sync_bucket_time']);
                myObject.endTime = myObject.startTime + bucketTime;

                myObject.googleFitRefreshToken = googleFitRefreshToken;

                context.bindings.outputQueueItem.push(JSON.stringify(myObject))
                context.log('Added user.');
            });

            connection.execSql(request);
        }
    });
}