module.exports = function (context, myQueueItem) {
    context.log(myQueueItem);
    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;
    const fitness = google.fitness('v1');
    var jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM('')).window;
    global.document = document;

    var $ = jQuery = require('jquery')(window);

    var googleClientId = process.env["google_client_id"];
    var googleClientSecret = process.env["google_secret"];
    var googleCallbackUrl = "http://localhost";

    // Values from queue
    var userId = myQueueItem["userId"];
    var saved_refresh_token = myQueueItem["googleFitRefreshToken"];
    var queryStartTime = myQueueItem["startTime"];
    var queryEndTime = myQueueItem["endTime"];

    // Query duration - 24H
    var queryDuration = 86400000;
    var oauth2Client = new OAuth2(googleClientId, googleClientSecret, googleCallbackUrl);
    oauth2Client.setCredentials({
        refresh_token: saved_refresh_token,
    });

    // set auth as a global default
    google.options({
        auth: oauth2Client
    });

    var aggreagteRequest = {
        aggregateBy: [
            {
                "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta"
            },
            {
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas"
            }
        ],
        bucketByTime: {
            "durationMillis": queryDuration
        },
        endTimeMillis: queryEndTime,
        startTimeMillis: queryStartTime,
    }

    var params = {
        userId: "me",
        resource: aggreagteRequest
    }

    var steps = fitness.users.dataset.aggregate(params, {}, function (status, data) {
        var userActivities = "";

        if (data && data.data && data.data.bucket) {
            try {
                data.data.bucket.forEach(buk => {
                    var startTime = buk.startTimeMillis;
                    var endTime = buk.endTimeMillis;
                    buk.dataset.forEach(ds => {
                        if (ds.point.length > 0) {
                            var val;
                            if (ds.point[0].value[0]["fpVal"]) {
                                val = ds.point[0].value[0]["fpVal"];
                            }
                            else {
                                val = ds.point[0].value[0]["intVal"]
                            }

                            userActivities += stringify({
                                dataSourceId: ds.dataSourceId,
                                startTimeMillis: buk.startTimeMillis,
                                endTimeMillis: buk.endTimeMillis,
                                val: val
                            }) + ",";
                        }
                    });
                });

                context.log("userActivity string was built");
                var postData = {
                    userId: userId,
                    userActivities: "[" + userActivities.substring(0, userActivities.length - 1) + "]"
                }

                postData.userActivities = postData.userActivities.replaceAll("\"", "\\\"");

                var data = "{ \"query\" : \"mutation {updateActivity(input:  {userId: \\\"" + userId + "\\\", userActivities: " + postData.userActivities + " } )}\" }";
                context.log(data);
                
                context.log("sending post query");
                $.post({
                    url: "http://sunflowersrvr.azurewebsites.net/graphql",
                    data: data,
                    contentType: 'application/json'
                }).done(function (response) {
                    context.log('User Activity Sent:', response.data);
                }).fail(function (xhr, status, error) {
                    context.log(error);
                });
            } catch (ex) {
                context.log(ex);
            }
        }
    });

    context.done();
}


function stringify(obj_from_json) {
    if (typeof obj_from_json !== "object" || Array.isArray(obj_from_json)) {
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
        .keys(obj_from_json)
        .map(key => `${key}:${stringify(obj_from_json[key])}`)
        .join(",");
    return `{${props}}`;
}

String.prototype.replaceAll = function (search, replace) {
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
}
