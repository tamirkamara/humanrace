const request = require('request');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const clientId = '291887666877-tfmttdff0s84jukc9nqsutdinn1s73hd.apps.googleusercontent.com';
const clientSecret = 'LQQl6TDX9oW2To9afvg9IS8O';

function getTokens(code) {
    var oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://www.google.com'
      );

  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, function (err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            //oauth2Client.setCredentials(tokens);
            console.info(JSON.stringify(tokens));
            resolve(tokens);
        }else{
            reject(err);
        }
    });
})
}

function verifyToken(accessToken) {
    var propertiesObject = { access_token : accessToken };
    
    request({url:'https://www.googleapis.com/oauth2/v1/tokeninfo', qs:propertiesObject}, function(err, response, body) {
      if(err) { 
          console.log(err); 
          return false; 
        }
      else {
          console.log("Response: " + JSON.stringify(response.body));
          var bodyJson = JSON.parse(response.body);
          if(bodyJson.issued_to == clientId){
            console.log("Client_id is verified");
            return true;
          }else{
            console.log("invalid client_id");
            return false;
          }
      }
      return;
    });
}


function refreshAccessKey(refreshKey){
    var oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://www.google.com'
    );

    oauth2Client.setCredentials({
        refresh_token: refreshKey
    });

    oauth2Client.refreshAccessToken(function(err, tokens) {
        console.log('tokens = ' + JSON.stringify(tokens));
        return tokens;
    });
}


module.exports = {
    getTokens,
    verifyToken,
    refreshAccessKey,
    clientId,
    clientSecret
}

