var {getTracksFromQuery} = require('../webAPI/searchTrackID');
//var {queries} = require('../webAPI/queriesSearch');

var request = require('request-promise');
var fs = require('fs');

//results from previous query
var musicsQuery = {};
var filterOptionsParam = { //features are all btw 0 and 1.
  //if you want to exclude a param, enter -1 so that all fit.
  danceability: 0,
  //indicates if we want filters above or below our number
  danceabilitySign: '+',
  valency: 0.5,
  valencySign: '+',
  energy: 0.9,
  energySign: '-',
  tempo: 80, //in bpm
  tempoSign: '+',
  popularity: 1,
  popularitySign: '-'
}

//getting result list of musics
var resultTracks = {};

//get random index (for now)...
//var randomIndex = parseInt(Math.floor(Math.random()*queries.length));
//var querySelected = queries[randomIndex];

var threeResultsSongs = [0,0,0];
var threeResultsSongsIndex = [0,0,0];
function checkWhatImportant(filterOptionsParam, result, index){
  //look at filter var
  var filter = filterOptionsParam.filter;
  if(result!=null && filter.localeCompare("happy") === 0){
    if(result.valence>Math.min(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) &&
      (index!=threeResultsSongsIndex[0]&&index!=threeResultsSongsIndex[1]&&index!=threeResultsSongsIndex[2])){
      for(var i = 0;i<threeResultsSongs.length;i++){
        if(Math.min(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) == threeResultsSongs[i]){
          threeResultsSongs[i] = result.valence;
          threeResultsSongsIndex[i] = index;
          break;
        }
      }
    }
  } else if(result!=null && filter.localeCompare("festive") === 0 &&
    !(index==threeResultsSongsIndex[0]||index==threeResultsSongsIndex[1]||index==threeResultsSongsIndex[2])){
    //console.log("RESULT: ");
    //console.log(Math.min(threeResultsSongs));
    if(result.tempo>Math.min(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2])){
      for(var i = 0;i<threeResultsSongs.length;i++){
        if(Math.min(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) == threeResultsSongs[i]){
          threeResultsSongs[i] = result.tempo;
          threeResultsSongsIndex[i] = index;
          break;
        }
      }
    }
  } else if(result!=null && filter.localeCompare("calm") === 0 &&
    (index!=threeResultsSongsIndex[0]&&index!=threeResultsSongsIndex[1]&&index!=threeResultsSongsIndex[2])){
    if(result.danceability<Math.max(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2])){
      for(var i = 0;i<threeResultsSongs.length;i++){
        if(Math.max(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) == threeResultsSongs[i]){
          threeResultsSongs[i] = result.danceability;
          threeResultsSongsIndex[i] = index;
          break;
        }
      }
    }
  } else{
    if(result!=null && filter.localeCompare("adventurous") === 0){
      if(result.popularity<Math.max(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) &&
      (index!=threeResultsSongsIndex[0]&&index!=threeResultsSongsIndex[1]&&index!=threeResultsSongsIndex[2])){
        for(var i = 0;i<threeResultsSongs.length;i++){
          if(Math.max(threeResultsSongs[0],threeResultsSongs[1],threeResultsSongs[2]) == threeResultsSongs[i]){
            threeResultsSongs[i] = result.popularity;
            threeResultsSongsIndex[i] = index;
            break;
          }
        }
      }
    }
  }
}

//evaluates if the song corresponds to our filters
function isParamAcceptable(resultParam, filterParam, paramSign){
  if(paramSign === '+'){
    if(resultParam >= filterParam){
      return true;
    }
  } else{
    if(resultParam < filterParam){
      return true;
    }
  }
  console.log('-------------');
  console.log(resultParam);
  console.log(filterParam);
  console.log(paramSign);
  return false;
}

function isTrackFiltered(result, filterOptions){
  if(isParamAcceptable(result.danceability, filterOptions.danceability,
    filterOptions.danceabilitySign) && isParamAcceptable(result.valence,
    filterOptions.valency, filterOptions.valencySign) &&
    isParamAcceptable(result.energy, filterOptions.energy, filterOptions.energySign) &&
    isParamAcceptable(result.tempo, filterOptions.tempo, filterOptions.tempoSign) &&
    isParamAcceptable(result.popularity, filterOptions.popularity, filterOptions.popularitySign)){
      return false;
    }

  return true;
}

function filterTracks(body_response, musicsFromQuery, filterOptions){
  //reset arrays
  threeResultsSongs = [0,0,0];
  threeResultsSongsIndex = [0,0,0];
  if("calm".localeCompare(filterOptions.filter) == 0 || "adventurous".localeCompare(filterOptions.filter) == 0){
    threeResultsSongs = [100,100,100];
  }

  var songsKept = [];
  //minimum of 3 songs kept, so we are looking for those that fit
  //the most with the filters...
  var json_response = JSON.parse(body_response);

  var results = json_response.audio_features;
  for(var i=0;i<results.length;i++){
    if(results[i]!=null){

      results[i].popularity = musicsFromQuery.popularity[i];
      //var isTrackFilteredBool = isTrackFiltered(results[i], filterOptions);
      //keep the 3 max values
      checkWhatImportant(filterOptions, results[i], i);

    }

  }
  console.log(results.length);
  console.log("Three index selected: "+threeResultsSongsIndex[0]+","+threeResultsSongsIndex[1]+","+threeResultsSongsIndex[2]);
  for(var i=0;i<threeResultsSongsIndex.length;i++){
    songsKept.push({"id":results[threeResultsSongsIndex[i]].id,
    "title":musicsFromQuery.musicNames[threeResultsSongsIndex[i]],
      "imgUrl":musicsFromQuery.imgURLs[threeResultsSongsIndex[i]],
      "artist":musicsFromQuery.musicArtists[threeResultsSongsIndex[i]]});
  }

  return {"results":songsKept};
}

async function getWantedMusic(query, filterOptions){
  var musicsFromQuery = await getTracksFromQuery(query);
  musicsQuery = musicsFromQuery;
  var musicIds = musicsFromQuery.musicIds;
  var responseDetailsRequest = {};

  //build url
  var url = `https://api.spotify.com/v1/audio-features/?ids=`;
  for(var i=0;i<musicIds.length;i++){
    url+=","+musicIds[i];
  }

  //console.log(url);
  var requestOptions = {
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${musicsFromQuery.access_token}`
    }
  };

  return request(requestOptions, function(error, response, body){
    if(!error){
      console.log("Music details received! In getTrackDetails.json");
      //to debug
      fs.writeFile('./spotify/searchLogs/getTrackDetails.json', body, (err) => {
        if(err){
          console.log("Error writing file: \n");
          console.log(err);
        }
      });

      response.destroy();
      return response;
    } else{
      console.log("There was an error retrieving music details...");
      console.log(error);
      return error;
    }

    response.destroy();
  }).then(function(response){
    resultTracks = filterTracks(response, musicsQuery, filterOptions);
    console.log("Results done!");
    return resultTracks;
    //example
    //console.log(JSON.stringify(resultTracks));
  });
}

//getWantedMusic(querySelected, filterOptionsParam);
module.exports = {getWantedMusic};
