var query = "a";
var videoId = "";

$(document).ready(function(){
  $("#play").click(async function(){
    //prepare the request.
    //q is the search value
    console.log(query);
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q:encodeURIComponent(query).replace(/%20/g,"+"),
      maxResults: 3,
      order: "viewCount",
      publishedAfter: "2003-01-01T00:00:00Z"
    });
    //execute the request
    request.execute(function(response){
      var results = response.result;
      videoId = results.items[0].id.videoId;
      loadYoutubeVideo(videoId);
      $.each(results.items, function(index, item){
        console.log(item);
      });
    });
  });
});

function init(){
  gapi.client.setApiKey("AIzaSyCuZM8y_ZboISbR3FDfE3kD3ShPqhJbdS0");
  gapi.client.load("youtube","v3", function(){

  });
}

function searchFor(query_){
  query=query_;
}

function loadYoutubeVideo(videoId){
  if(document.getElementById("youtubeVid") == null){
    var vid = document.createElement("iframe");
    vid.id = "youtubeVid";
    //vid.width = "500";
    vid.height = "300";
    vid.fullscreen = true;
    vid.frameborder = "0";
    vid.src="http://www.youtube.com/embed/"+videoId;
    vid.videoId = videoId;
    vid.style="position:absolute;left:25%;width:40%;top:320px;";
    document.body.appendChild(vid);
  } else if(videoId.localeCompare(document.getElementById("youtubeVid").videoId)!=0){
    document.getElementById("youtubeVid").remove();
    var vid = document.createElement("iframe");
    vid.id = "youtubeVid";
    //vid.width = "500";
    vid.height = "300";
    vid.fullscreen = true;
    vid.frameborder = "0";
    vid.src="http://www.youtube.com/embed/"+videoId;
    vid.style="position:absolute;left:25%;width:40%;top:320px;";
    vid.videoId = videoId;
    document.body.appendChild(vid);
  }
}
