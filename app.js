const CLIENT_ID = 'a76798888aba4544866c66b27a161138'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your redirect URI
let accessToken = null;

// Spotify API endpoints
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played';
const PLAY_URL = 'https://api.spotify.com/v1/me/player/play';
const DEVICES_URL = 'https://api.spotify.com/v1/me/player/devices';

// Fetch available devices
async function checkAvailableDevices() {
  try {
    const response = await axios.get(DEVICES_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const devices = response.data.devices;

    if (devices.length === 0) {
      alert('No active Spotify devices found. Please open Spotify and start playback on a device.');
      console.error('No active devices:', devices);
      return null;
    }

    console.log('Available devices:', devices);
    return devices[0].id; // Use the first active device
  } catch (error) {
    console.error('Error checking devices:', error);
    alert('Failed to fetch devices. Please try again.');
    return null;
  }
}


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
}

// Initialize App
function initializeApp() {
    if (!accessToken) {
        extractAccessToken();
    }
}

document.getElementById('authenticateBtn').addEventListener('click', authenticateSpotify);
document.getElementById('playTracksBtn').addEventListener('click', fetchAndPlayRecentlyPlayedTracks);

// Call the initialize function when the page loads
initializeApp();
