async function getTracksBackend(){
  return await
  $.ajax({
    type:"GET",
    url:"/getMoodTracks?q=pop&filter=happy",
    success: function(response){
      //results are in ['results']. From there, you can
      //go to id, title, imgUrl, artist.
      //['results'][0]['title']
      return JSON.parse(response);
      //window.alert(response);
    }
  });
}

async function getTracksBackend(query, filter){
  return await
  $.ajax({
    type:"GET",
    url:"/getMoodTracks?q="+query+"&filter="+filter,
    success: function(response){
      //results are in ['results']. From there, you can
      //go to id, title, imgUrl, artist.
      //['results'][0]['title']
      //return JSON.parse(response);
      window.location.href = "/viewYoutubeAPI";
      //window.alert(response);
    }
  });
}

async function getTracksBackendResult(query, filter){
  return await
  $.ajax({
    type:"GET",
    url:"/getMoodTracks?q="+query+"&filter="+filter,
    success: function(response){
      //results are in ['results']. From there, you can
      //go to id, title, imgUrl, artist.
      //['results'][0]['title']
      return JSON.parse(response);
      //window.alert(response);
    }
  });
}

async function getTracksBackendResult(){
  return await
  $.ajax({
    type:"GET",
    url:"/getMoodTracksRegistered",
    success: function(response){
      //results are in ['results']. From there, you can
      //go to id, title, imgUrl, artist.
      //['results'][0]['title']
      if(response===""){
        return "";
      }
      return JSON.parse(response);
      //window.alert(response);
    }
  });
}

async function setTracksBackendResult(musicResults){
  return await
  $.ajax({
    type:"GET",
    url:"/setMoodTracksRegistered",
    data:JSON.parse(musicResults),
    contentType:"application/json",
    success: function(response){
      return response;
    }
  })
}

function getTrackArtist(response, index){
  return response.results[index].artist;
}

function getTrackTitle(response, index){
  return response.results[index].title;
}

function getTrackImageURL(response, index){
  return response.results[index].imgUrl;
}
