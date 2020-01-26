// https://github.com/spotify/web-api-auth-examples/blob/master/client_credentials/app.js
var request = require('request-promise');
// set from Spotify website
const redirect_URI = 'localhost:3000/callback';

// get those from Spotify website
const client_secret = '5d4814e6005e4a4cbbbdd20e25b79283';
const client_id = 'c41b9e1c66a646eabe1e35357b205a94';

// set after first request
var access_token = '';
var audio_features_options = {};

// the connection with the API times out after 3600s, which amounts to 1h
function establish_connection(){
  return request.post(authOptions, function(error, response, body){
      if(!error && response.statusCode === 200){
        access_token = body.access_token;
        console.log("Connection established...");
        my_response = response;
        response.destroy();
        return my_response;
        //console.log(body);
      } else{
        //console.log("In spotifyRequest.js' establish_connection method:\n");
        console.log("Connection failed...");
        console.log(error);
        return error;
      }
      response.destroy();
    });
}

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

module.exports = {establish_connection};
