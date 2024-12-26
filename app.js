const clientId = 'a76798888aba4544866c66b27a161138'; // Replace with your app's Client ID
const redirectUri = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your app's Redirect URI
const scopes = ['user-read-private', 'user-read-email', 'user-follow-read']; // Add other scopes as needed
let accessToken = null;

// Authenticate with Spotify
function authenticateSpotify() {
    const scope = scopes.join(' ');
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    // Redirect to Spotify's authentication page
    window.location.href = authURL;
}

// Extract Access Token from URL hash
function extractAccessToken() {
    if (!accessToken) {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // Remove the `#` prefix
            accessToken = params.get('access_token');
            // console.log('Access Token:', accessToken);

            if (accessToken) {
                // Remove the token from the URL for cleaner browsing
                window.location.hash = '';
            } else {
                console.error('Access token not found. Please authenticate.');
            }
        }
    }
}

// Fetch User Profile Data
async function fetchUserProfile() {
    if (!accessToken) {
        console.error('No access token available. Please authenticate.');
        return;
    }

    const PROFILE_URL = 'https://api.spotify.com/v1/me';

    try {
        const response = await fetch(PROFILE_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const profileData = await response.json();
        console.log('User Profile Data:', profileData);

        // Example: Display the user's name
        alert(`Welcome, ${profileData.display_name}!`);
        alert(`Email, ${profileData.email}!`);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

async function fetchFollowedArtists() {
    if (!accessToken) {
        console.error('No access token available. Please authenticate.');
        return;
    }

    const FOLLOWING_URL = 'https://api.spotify.com/v1/me/following?type=artist';

    try {
        const response = await fetch(FOLLOWING_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const artists = data.artists.items;

        console.log('Followed Artists:', artists);

        // Display the artists' names
        const artistNames = artists.map(artist => artist.name).join(', ');
        alert(`Followed Artists: ${artistNames}`);
    } catch (error) {
        console.error('Error fetching followed artists:', error);
    }
}

// Initialize App
function initializeApp() {
    extractAccessToken();
    if (accessToken) {
        console.log('Access token already extracted.');
    }
}

// Call initializeApp when the page loads
initializeApp();

// Event Listeners
document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
document.getElementById('getProfileBtn').addEventListener('click', fetchUserProfile);
document.getElementById('getArtistBtn').addEventListener('click', fetchFollowedArtists);

