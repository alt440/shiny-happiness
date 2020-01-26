var {establish_connection} = require('./spotifyAccessToken');
var request = require('request-promise');

var query = "a";


//returns image URL link, URI to music, and name of music
function extractTracksInfo(body_response){
  var imgURLs = [];
  var musicURIs = [];
  var musicNames = [];

  //first parse JSON response
  var json_response = JSON.parse(body_response);
  //console.log("JSON RESPONSE:");
  //console.log(json_response);
  var results = json_response.tracks.items;
  for(var i=0;i<results.length;i++){
    imgURLs.push(results[i].album.images[0].url);
    musicURIs.push(results[i].uri);
    musicNames.push(results[i].name);
  }

  var musicContents = {
    imgURLs:imgURLs,
    musicURIs:musicURIs,
    musicNames:musicNames
  };

  return musicContents;
}

function getPlaylistsFromQuery(query){
  var url = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=50`;
  establish_connection().then(function(response){

    var requestOptions = {
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${response.access_token}`
      }
    };

    return request(requestOptions, function(error, response, body){
      if(!error){
        console.log("Playlists collected!");
        console.log(body);
      } else{
        console.log("Failed to collect playlists...");
        console.log(error);
      }
    });
  }).then(function(response){
    //var musicContents = extractTracksInfo(response);
    //return musicContents;
  });
}

getPlaylistsFromQuery(query);
module.exports = {getPlaylistsFromQuery};
