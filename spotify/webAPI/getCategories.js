var {establish_connection} = require('./spotifyAccessToken');
var request = require('request-promise');

var url = `https://api.spotify.com/v1/browse/categories`;
establish_connection().then(function(response){

  var requestOptions = {
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${response.access_token}`
    }
  };

  request(requestOptions, function(error, response, body){
    if(!error){
      console.log("Categories collected!");
      console.log(body);
    } else{
      console.log("Failed to collect categories...");
      console.log(error);
    }
  });
});
