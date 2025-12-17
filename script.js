function sendSOS() {
    const status = document.getElementById("status");

    // Vibration (mobile only)
    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }

    // Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                status.innerHTML = `
                    🚨 SOS Sent! <br>
                    📍 Location:<br>
                    Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}
                `;

                // Emergency call (India example: 112)
                setTimeout(() => {
                    window.location.href = "tel:112";
                }, 1500);
            },
            () => {
                status.innerHTML = "❌ Location access denied.";
            }
        );
    } else {
        status.innerHTML = "❌ Geolocation not supported.";
    }
}
