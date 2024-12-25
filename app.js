// Spotify API credentials (replace with your values)
const CLIENT_ID = 'a76798888aba4544866c66b27a161138';
const CLIENT_SECRET = '53d02a7e23cd442b9037dbe5d51f058f';
let accessToken = null;

// Fetch access token
async function getAccessToken() {
    const tokenURL = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(tokenURL, null, {
        params: { grant_type: 'client_credentials' },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`,
        },
    });
    accessToken = response.data.access_token;
}

// Get track info and update UI
async function getTrackInfo(trackId) {
    const trackURL = `https://api.spotify.com/v1/tracks/${trackId}`;
    const response = await axios.get(trackURL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const track = response.data;

    // Update UI
    document.getElementById('trackName').textContent = track.name;
    document.getElementById('artistName').textContent = track.artists[0].name;
    document.getElementById('albumArt').src = track.album.images[0].url;
}

// Initialize player with a sample track
async function initializePlayer() {
    await getAccessToken();
    getTrackInfo('3n3Ppam7vgaVa1iaRUc9Lp'); // Example track ID
}

// Event listeners for controls
document.getElementById('playPauseBtn').addEventListener('click', () => {
    alert('Play/Pause functionality not implemented yet.');
});
document.getElementById('prevBtn').addEventListener('click', () => {
    alert('Previous track functionality not implemented yet.');
});
document.getElementById('nextBtn').addEventListener('click', () => {
    alert('Next track functionality not implemented yet.');
});

// Load the player
initializePlayer();