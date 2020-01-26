var {establish_connection} = require('./spotifyAccessToken');
var request = require('request-promise');
var fs = require('fs');

var query = "a";

//returns image URL link, URI to music, and name of music
function extractTracksInfo(body_response){
  var imgURLs = [];
  var musicIds = [];
  var musicNames = [];
  var musicArtists = [];
  var popularity = [];

  //first parse JSON response
  var json_response = JSON.parse(body_response);
  //console.log("JSON RESPONSE:");
  //console.log(json_response.tracks.items);
  var results = json_response.tracks.items;
  for(var i=0;i<results.length;i++){

    if(!results[i].explicit){
      imgURLs.push(results[i].album.images[0].url);
      musicIds.push(results[i].id);
      musicNames.push(results[i].name);
      musicArtists.push(results[i].album.artists[0].name);
      popularity.push(results[i].popularity);
    }
  }

  var musicContents = {
    imgURLs:imgURLs,
    musicIds:musicIds,
    musicNames:musicNames,
    musicArtists:musicArtists,
    popularity: popularity
  };

  return musicContents;
}

async function getTracksFromQuery(query){

    var access_token = '';
    var url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50`;

    var responseConnection = await establish_connection();
    var requestOptions = {
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${responseConnection.access_token}`
      }
    };

    access_token = responseConnection.access_token;

    return request(requestOptions, function(error, response, body){
      if(!error){
        console.log("Tracks collected! In searchTrack.json");
        //to debug
        fs.writeFile('./spotify/searchLogs/searchTrack.json', body, (err) => {
          if(err){
            console.log("Error writing file: \n");
            console.log(err);
          }
        });
        response.destroy();
        return response;
      } else{
        console.log("Failed to collect tracks...");
        //console.log(error);
        return response;
      }

      response.destroy();
    }).then(function(response){
      var musicContents = extractTracksInfo(response);

      musicContents.access_token = access_token;
      return musicContents;
    });
}

//getTracksFromQuery(query);
module.exports = {getTracksFromQuery};
