const clientId = 'a76798888aba4544866c66b27a161138'; // Replace with your app's Client ID
const redirectUri = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your app's Redirect URI
const scopes = ['user-read-private', 'user-read-email', 'user-follow-read', 'playlist-read-private', 'playlist-read-collaborative', 'user-read-playback-state', 'user-modify-playback-state', 'streaming']; // Add other scopes as needed
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

            if (accessToken) {
                // Remove the token from the URL for cleaner browsing
                window.location.hash = '';
            } else {
                console.error('Access token not found. Please authenticate.');
            }
        }
    }
}

async function fetchDevices() {
    if (!accessToken) {
        console.error('No access token available. Please authenticate.');
        return;
    }

    const DEVICES_URL = 'https://api.spotify.com/v1/me/player/devices';

    try {
        const response = await fetch(DEVICES_URL, {
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
        const devices = data.devices;

        console.log('Available Devices:', devices);

        if (devices.length === 0) {
            console.log('No devices found.');
            alert('No active devices found. Please start playing music on a device.');
        } else {
            console.log('Available Devices:', devices);
            const activeDevice = devices.find(device => device.is_active);
            if (activeDevice) {
                console.log('Active Device:', activeDevice);
                playTrack(activeDevice.id, "spotify:playlist:5NyycdxSfDCOHiN92UQvQd"); // Example track URI
            } else {
                console.log('No active device available to play music.');
            }
        }

    } catch (error) {
        console.error('Error fetching devices:', error);
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

async function fetchUserPlaylists() {
    if (!accessToken) {
        console.error('No access token available. Please authenticate.');
        return;
    }

    const PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists?limit=5';  // Fetch first 5 playlists

    try {
        const response = await fetch(PLAYLISTS_URL, {
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
        const playlists = data.items;

        console.log('User Playlists:', playlists);

    } catch (error) {
        console.error('Error fetching user playlists:', error);
    }
}

async function playTrack(deviceId, trackUri) {
    const PLAY_URL = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;

    try {
        const response = await fetch(PLAY_URL, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: [trackUri], // URI of the track you want to play
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('Track is playing...');
    } catch (error) {
        console.error('Error playing track:', error);
        alert('Error playing the track. Make sure Spotify is open and a device is active.');
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
document.getElementById('fetchPlaylistsBtn').addEventListener('click', fetchUserPlaylists);
document.getElementById('playBtn').addEventListener('click', fetchDevices);


