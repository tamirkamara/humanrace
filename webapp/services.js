var request = require('request');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

async function getTokensApi(clientId, clientSecret, code) {
    var formData = {
            client_id: clientId, //291887666877-tfmttdff0s84jukc9nqsutdinn1s73hd.apps.googleusercontent.com
            client_secret: clientSecret, //LQQl6TDX9oW2To9afvg9IS8O
            code: code, //4/71e3iB2sVI-5zWAaQXRCtF4crhxefhAUpEi83_KG-mU#
            grant_type: 'authorization_code',
            redirect_uri:'https://www.google.com'
    }

    //var result = await 
    request.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        form: formData
    }, function optionalCallback(err, httpResponse, body){
        if (err) {
            return console.error('request failed:', err);
            //return {};
        }
        console.log('Response from Google APIs server:', body);
        //return body;
    });
}

function getTokens(clientId, clientSecret, code) {
    var oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://www.google.com'
      );
      
    oauth2Client.getToken(code, function (err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
            console.info(JSON.stringify(tokens));
        }else{
            return console.error('request failed:', err);
        }
    });
}


module.exports = {
    getTokensApi,
    getTokens
}