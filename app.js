const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;

// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played';

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-recently-played';
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
            fetchRecentlyPlayedTracks();
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

// Step 3: Fetch Recently Played Tracks
async function fetchRecentlyPlayedTracks() {
    try {
        const response = await axios.get(RECENTLY_PLAYED_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 5 }, // Fetch only the latest 5 tracks
        });

        const tracks = response.data.items;

        // Display the tracks
        const trackList = tracks.map((item, index) => {
            const track = item.track;
            return `${index + 1}. ${track.name} by ${track.artists
                .map((artist) => artist.name)
                .join(', ')}`;
        });

        alert(`Your Last 5 Tracks:\n${trackList.join('\n')}`);
        console.log('Recently Played Tracks:', trackList);
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        alert('Failed to fetch recently played tracks. Please try again.');
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
document.getElementById('fetchTracksBtn').addEventListener('click', fetchRecentlyPlayedTracks);

// Call the initialize function when the page loads
initializeApp();