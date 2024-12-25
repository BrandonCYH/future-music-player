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
        console.log(devices);

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

// Call this function to list available devices
checkAvailableDevices();

// Step 1: Handle OAuth Authentication
function authenticateSpotify() {
    const scope = 'user-read-playback-state user-modify-playback-state';
    // const scope = 'user-read-recently-played user-modify-playback-state user-read-playback-state';
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
async function playTracksOnDevice(uris, deviceId) {
    deviceId = "b4d5f851b68f4a98276e2ee839b1905122d5d0ad";
    try {
        await axios.put(
            `${PLAY_URL}?device_id=${deviceId}`,
            { uris }, // Array of track URIs to play
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Playing tracks on device:', deviceId);
        alert('Tracks are now playing!');
    } catch (error) {
        console.error('Error playing tracks:', error);
        alert('Failed to play tracks. Ensure the device is active.');
    }
}

async function getDeviceAndPlayTracks(uris) {
    try {
        const response = await axios.get(DEVICES_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const devices = response.data.devices;

        if (devices.length === 0) {
            alert('No active Spotify devices found. Please activate a device.');
            return;
        }

        // Find the Spotify Web Player device (or use the first available device)
        const webPlayer = devices.find((device) => device.type === 'Computer');
        const selectedDeviceId = webPlayer ? webPlayer.id : devices[0].id;

        console.log('Using device:', selectedDeviceId);
        playTracksOnDevice(uris, selectedDeviceId);
    } catch (error) {
        console.error('Error fetching devices or playing tracks:', error);
        alert('Failed to get devices or play tracks.');
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
document.getElementById('playTracksBtn').addEventListener('click', fetchAndPlayRecentlyPlayedTracks);

// Call the initialize function when the page loads
initializeApp();