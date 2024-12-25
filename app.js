const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;
let player = null;

<<<<<<< HEAD
// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played';
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-recently-played user-modify-playback-state user-read-playback-state';
    const authURL = `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
=======
const scope = 'user-read-private user-read-email streaming'; // Add 'streaming' scope for Web Playback

// Step 1: Authenticate with Spotify
function authenticateSpotify() {
    const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
>>>>>>> ef8637fe05db839bc9681fb33eb33f90e0a60d81
        REDIRECT_URI
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authURL;
}

// Step 2: Extract access token from URL
function extractAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        accessToken = params.get('access_token');
        if (accessToken) {
            initializeSpotifyPlayer(); // Initialize the player if access token is found
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

<<<<<<< HEAD
// Step 3: Fetch and Play Recently Played Tracks
async function fetchAndPlayRecentlyPlayedTracks() {
  try {
    // Fetch Recently Played Tracks
    const response = await axios.get(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 5 }, // Fetch only the latest 5 tracks
    });

    const tracks = response.data.items;
    const trackUris = tracks.map((item) => item.track.uri); // Extract track URIs

    console.log('Recently Played Tracks URIs:', trackUris);

    // Play Tracks
    await playTracks(trackUris);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    alert('Failed to fetch or play recently played tracks. Please try again.');
  }
}

// Step 4: Play Tracks on Spotify
async function playTracks(uris) {
    try {
        await axios.put(
            PLAY_URL,
            { uris }, // Pass the array of track URIs
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        alert('Playing your last 5 tracks!');
        console.log('Playing tracks:', uris);
    } catch (error) {
        console.error('Error playing tracks:', error);
        alert('Ensure a Spotify device is active for playback.');
    }
=======
// Step 3: Initialize Spotify Player
function initializeSpotifyPlayer() {
    if (accessToken) {
        // Initialize the Web Playback SDK
        window.onSpotifyWebPlaybackSDKReady = () => {
            player = new Spotify.Player({
                name: 'Web Playback SDK Example',
                getOAuthToken: (cb) => { cb(accessToken); },
                volume: 0.5
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback state updates
            player.addListener('player_state_changed', (state) => {
                console.log(state);
            });

            // Ready to play
            player.addListener('ready', ({ device_id }) => {
                console.log('Player is ready with device ID', device_id);
                // Play a song here after initializing
                playSong();
            });

            // Connect to the player
            player.connect();
        };
    }
}

// Step 4: Play a song
function playSong() {
    // Replace this track URI with any valid Spotify track URI
    const trackUri = 'spotify:track:73bExgLbebZU8nmW9uDuJV'; // Example track

    player.play({
        uris: [trackUri]
    }).then(() => {
        console.log('Now playing the track');
    }).catch(error => {
        console.error('Error playing the track', error);
    });
>>>>>>> ef8637fe05db839bc9681fb33eb33f90e0a60d81
}

// Step 5: Initialize the app
function initializeApp() {
    extractAccessToken();
}

<<<<<<< HEAD
// Call the initialize function when the page loads
initializeApp();
=======
document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
document.getElementById('playPauseBtn').addEventListener('click', () => {
    player.togglePlay().then(() => {
        console.log('Playback toggled');
    });
});
>>>>>>> ef8637fe05db839bc9681fb33eb33f90e0a60d81
