const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;

// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const PROFILE_URL = 'https://api.spotify.com/v1/me';
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-playback-state user-modify-playback-state';
    const authURL = `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authURL;
}

// Step 2: Extract the Access Token from URL (after redirect)
function extractAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove the `#` prefix
        accessToken = params.get('access_token');
        if (accessToken) {
            alert('Authentication successful! You can now play songs.');
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

// Step 3: Play a Specific Track on Spotify
async function playTrack(uri) {
    try {
        const response = await axios.put(
            PLAY_URL,
            { uris: [uri] }, // Track URI
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Playing track:', uri);
        alert('Now playing: Shania Yan - Sick of You');
    } catch (error) {
        console.error('Error playing track:', error);
        if (error.response?.status === 403) {
            alert('Ensure a Spotify device is active for playback.');
        } else {
            alert('Failed to play the track. Please try again.');
        }
    }
}

// Initialize App
function initializeApp() {
    if (!accessToken) {
        extractAccessToken();
    }
}

// Event Listeners
document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
document.getElementById('playPauseBtn').addEventListener('click', () => {
    const trackUri = 'spotify:track:0V5nFZrkCFLz0zJSNOOdJl'; // Shania Yan - Sick of You
    playTrack(trackUri);
});

// Call the initialize function when the page loads
initializeApp();
