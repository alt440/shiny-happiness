window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBiNOjNikNdJLErkFTnGxHVKZtyCgXeltMilyAxWdoWqs1aX1cJnROIpZbpnf9oXy2xQqfja48QX80fe7nX6b6jQ289hlev8YDL9J113fppXxm4Sb3WP4WRUhkMAZ2APQA9ObYvBMPC5EfxSAN45w5KtYYF0RK_xMkwqKnyXrQceM_RTWQ';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
  };
  