const clientId = 'a76798888aba4544866c66b27a161138'; // Replace with your app's Client ID
const redirectUri = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your app's Redirect URI
const scopes = [
    'user-read-private',
    'user-read-email', // Add other scopes as needed
];

function authenticateWithSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=token&` + // Use 'code' for Authorization Code Flow
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes.join(' '))}`;

    // Redirect to the Spotify login page
    window.location.href = authUrl;
}

document.getElementById("authenticateBtn").addEventListener("click", authenticateWithSpotify);

const apiEndPoints = "https://api.spotify.com/v1/me";

fetch(apiEndPoints)
    .then(response => response.json)
    .then(data => {
        console.log(data);
    })