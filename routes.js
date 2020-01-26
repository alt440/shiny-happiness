var {getWantedMusic} = require('./spotify/webAPIcalls/getTrackDetails');
var {queries} = require('./spotify/webAPI/queriesSearch');
var {getHappyFilter, getFestiveFilter, getCalmFilter, getAdventurousFilter} =
  require('./spotify/moodSearch/moodFilters');

var musicList = {};
//done this way to easily incorporate passport
module.exports = function(app, passport){

  app.get('/', function(req, res){
    res.render('index.ejs');
  });

  app.get('/login', function(req, res){
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  app.get('/playListChooser', function(req, res){
    res.render('playListChooser.ejs');
  });

  //using strategy we defined in passport.js called local-login
  app.post('/login', passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function(req, res){
    res.render('signup.ejs', { message: req.flash('signupMessage')});
  });

  //using strategy we defined in passport.js called local-signup
  app.post('/signup', passport.authenticate('local-signup', {
    sucessRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true //allow flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', {
      user: req.user //passing user to html
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/viewTracks', function(req, res){
    var filterOptionsParam = { //features are all btw 0 and 1.
      //if you want to exclude a param, enter -1 so that all fit.
      danceability: 1,
      //indicates if we want filters above or below our number
      danceabilitySign: '-',
      valency: 0.5,
      valencySign: '+',
      energy: 0.9,
      energySign: '-',
      tempo: 80, //in bpm
      tempoSign: '+'
    }

    //select query
    var randomIndex = parseInt(Math.floor(Math.random()*queries.length));
    var querySelected = queries[randomIndex];
    var trackResults = {};
    getWantedMusic(querySelected, filterOptionsParam).then(function(resultTracks){
      trackResults = resultTracks;
      console.log(trackResults);
      res.render('viewTracks.ejs', {
        tracks: trackResults
      });
    });

  });

  app.get('/getMoodTracks', async function(req, res){
    var filterOptionsParam = { //features are all btw 0 and 1.
      //if you want to exclude a param, enter -1 so that all fit.
      danceability: 1,
      //indicates if we want filters above or below our number
      danceabilitySign: '-',
      valency: 0.5,
      valencySign: '+',
      energy: 0.9,
      energySign: '-',
      tempo: 80, //in bpm
      tempoSign: '+',
      popularity: 1,
      popularitySign: '-'
    };
    var querySelected = req.query.q;
    var filterSelected = req.query.filter;
    //console.log(filterSelected);
    //console.log(querySelected);

    if(filterSelected.localeCompare("happy") == 0){
      filterOptionsParam = getHappyFilter();
      console.log("Happy filter selected");
    } else if(filterSelected.localeCompare("festive") == 0){
      filterOptionsParam = getFestiveFilter();
      console.log("Festive filter selected");
    } else if(filterSelected.localeCompare("calm") == 0){
      filterOptionsParam = getCalmFilter();
      console.log("Calm filter selected");
    } else if(filterSelected.localeCompare("adventurous") == 0){
      filterOptionsParam = getAdventurousFilter();
      console.log("Adventurous filter selected");
    }

    var trackResults = await getWantedMusic(querySelected, filterOptionsParam)
    .then(function(resultTracks){
      trackResults = resultTracks;
      console.log("Done!");
      return JSON.stringify(trackResults);
    });

    var parsedResults = JSON.parse(trackResults);

    //this is how we end the request
    if(trackResults !== undefined && parsedResults.results.length !=0){
      console.log("Found tracks!");
      console.log(trackResults);
      app.set('tracks', trackResults);
      musicList = trackResults;
      res.end(trackResults);
    }
    else{
      musicList = `{"results":[]}`;
      app.set('tracks', `{"results":[]}`);
      res.end();
    }
  });

  app.get('/getMoodTracksRegistered', function(req, res){
    res.end(app.get('tracks'));
  });

  app.get('/viewSpotifyMusic', function(req, res){
    res.render('viewSpotifyMusic.ejs');
  });

  app.get('/viewYoutubeAPI', function(req, res){

    res.render('viewYoutubeJSAPI.ejs', {tracks: musicList});
    //res.render('viewYoutubeJSAPI.ejs', {tracks: req.tracks});
  });

  app.get('/viewYoutubeAPI2', function(req, res){
    res.render('youtubePlaylist.ejs');
    //res.render('viewYoutubeJSAPI.ejs', {tracks: req.tracks});
  });

  app.get('/viewTracksIntegrated', function(req, res){
    res.render('viewTracksIntegrated.ejs');
  });

  app.get('/setMoodTracksRegistered', function(req, res){
    console.log("BODY:"+JSON.stringify(req.body));
    musicList = JSON.stringify(req.body);
    //app.set('tracks', JSON.stringify(req.body));
    console.log("TRACKS:"+musicList);
    res.end('YAY!');
  });
};

function isLoggedIn(req, res, callback){
  if(req.isAuthenticated()){
    return callback();
  }

  res.redirect('/');
}
