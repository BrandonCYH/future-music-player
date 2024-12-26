const clientId = 'a76798888aba4544866c66b27a161138'; // Replace with your app's Client ID
const clientSecret = '53d02a7e23cd442b9037dbe5d51f058f';
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const redirectUri = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your app's Redirect URI
const scopes = [
    'user-read-private',
    'user-read-email', // Add other scopes as needed
];
let accessToken = null;

function authenticateSpotify() {
    const scope = 'user-read-private'; // Permissions for user profile data
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    // Redirect to Spotify's authentication page
    window.location.href = authURL;
}

function extractAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove the `#` prefix
        const accessToken = params.get('access_token');
        console.log('Access Token:', accessToken);

        if (accessToken) {
            fetchUserProfile(accessToken); // Pass the token to fetch profile data
        } else {
            console.error('Access token not found. Please authenticate.');
        }
    }
}

extractAccessToken();

async function fetchUserProfile(accessToken) {
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
    } catch (error) {
        console.error('Error fetching user profile:', error);
        console.log(accessToken);
    }
}

document.getElementById("authenticateBtn").addEventListener("click", authenticateSpotify);
document.getElementById("getProfileBtn").addEventListener("click", fetchUserProfile);



