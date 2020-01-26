var {establish_connection, access_token} = require('./spotifyAccessToken');

var url = `https://api.spotify.com/v1/me/player/play?device_id=${id}`;
establish_connection().then(
  request({
    url: url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
);
