const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;

// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played';
// Spotify Web API Play URL
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-recently-played user-modify-playback-state user-read-playback-state';
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
            fetchAndPlayRecentlyPlayedTracks();
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

// Step 3: Fetch and Play Recently Played Tracks
async function fetchRecentlyPlayedTracks() {
    try {
        const response = await fetch(RECENTLY_PLAYED_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Recently Played Tracks:', data);

        // Get the URI of the first track (or adjust logic for your needs)
        const firstTrackUri = data.items[0].track.uri;

        // Play the first track
        playTrack(firstTrackUri);
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
    }
}

async function playTrack(trackUri) {
    try {
        const response = await fetch(PLAY_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: [trackUri],  // Use the track URI to play it
            }),
        });

        if (response.ok) {
            console.log('Playing track:', trackUri);
            // Play the first track from the playlist
            const firstTrackUri = trackUri.items[0].track.uri;
            playTrack(firstTrackUri);
        } else {
            console.error('Error playing track:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error playing track:', error);
    }
}

// Fetch and play recently played tracks
fetchRecentlyPlayedTracks();

// Initialize App
function initializeApp() {
    if (!accessToken) {
        extractAccessToken();
    }
}

// Event Listeners
document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
document.getElementById('playTracksBtn').addEventListener('click', fetchRecentlyPlayedTracks);

// Call the initialize function when the page loads
initializeApp();