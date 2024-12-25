const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;
let player = null;

const scope = 'user-read-private user-read-email streaming'; // Add 'streaming' scope for Web Playback

// Step 1: Authenticate with Spotify
function authenticateSpotify() {
    const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
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
    const trackUri = 'https://open.spotify.com/track/73bExgLbebZU8nmW9uDuJV'; // Example track

    player.play({
        uris: [trackUri]
    }).then(() => {
        console.log('Now playing the track');
    }).catch(error => {
        console.error('Error playing the track', error);
    });
}

// Step 5: Initialize the app
function initializeApp() {
    extractAccessToken();
}

document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
