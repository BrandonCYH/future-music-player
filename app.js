const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:5500'; // Replace with your redirect URI
let accessToken = null;

// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const PROFILE_URL = 'https://api.spotify.com/v1/me';
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-playback-state user-modify-playback-state user-read-private';
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
            fetchProfileData();
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

// Step 3: Fetch Spotify Profile Data
async function fetchProfileData() {
    try {
        const response = await axios.get(PROFILE_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profile = response.data;

        // Update the UI with user profile data
        console.log('Profile Data:', profile);
        alert(`Welcome ${profile.display_name}!`);
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}

// Step 4: Play a Track on Spotify
async function playTrack(uri) {
    try {
        const response = await axios.put(
            PLAY_URL,
            { uris: [uri] }, // Replace with your desired track URI
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Playing track:', uri);
    } catch (error) {
        console.error('Error playing track:', error);
        alert('Ensure a Spotify device is active for playback.');
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
    const exampleTrackUri = 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'; // Example track URI
    playTrack(exampleTrackUri);
});

// Call the initialize function when the page loads
initializeApp();