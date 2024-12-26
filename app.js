const clientId = 'a76798888aba4544866c66b27a161138'; // Replace with your app's Client ID
const redirectUri = 'https://brandoncyh.github.io/future-music-player/music_player'; // Replace with your app's Redirect URI
const scopes = ['user-read-private', 'user-read-email', 'user-follow-read', 'playlist-read-private', 'playlist-read-collaborative', 'user-read-playback-state', 'user-modify-playback-state', 'streaming']; // Add other scopes as needed
let accessToken = null;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBBKWzyNKgjowIjZxWFVzxulTqZO01nMDuL3lawn_o6AEEijCpebj7kKTWZC3X3Kw6bROHJR7_6xwWjtYO331LlAEUFRt11fAJc_x1PlJEzT0oCQuB1m9YVeysjBj2ASBAp8HdlDP-QEM2KISF9b3CeWTphjjtUcJtbJI9OLMWgCcw6WVlOTMdB8aC1E5qpwfmjNCxAi7NYFeLDgQsEaw5Ye55dGFGIZvIv';
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function () {
        player.togglePlay();
    };

    player.connect();
}

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

        if (devices.length === 0) {
            console.log('No devices found.');
            alert('No active devices found. Please start playing music on a device.');
        } else {
            console.log('Available Devices:', devices);
            const activeDevice = devices.find(device => device.is_active);
            if (activeDevice) {
                console.log('Active Device:', activeDevice);
            } else {
                console.log('No active device available to play music.');
            }
        }

    } catch (error) {
        console.error('Error fetching devices:', error);
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


