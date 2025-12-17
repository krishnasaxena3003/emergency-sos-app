document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("sosBtn");
    const status = document.getElementById("status");
    let timer;

    // =========================
    // DEMO EMERGENCY CONTACTS
    // =========================
    const emergencyContacts = [
        "916398758826",
        "917408141149",
        "919528544923",
        "917037754617"
    ];
    // Replace with real numbers (country code, no +)

    // =========================
    // AI VOICE
    // =========================
    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    // =========================
    // LONG PRESS LOGIC
    // =========================
    function startPress() {
        status.innerText = "Holding...";
        timer = setTimeout(sendSOS, 2000);
    }

    function cancelPress() {
        clearTimeout(timer);
        status.innerText = "";
    }

    btn.addEventListener("mousedown", startPress);
    btn.addEventListener("mouseup", cancelPress);
    btn.addEventListener("touchstart", startPress);
    btn.addEventListener("touchend", cancelPress);

    // =========================
    // MAIN SOS FUNCTION
    // =========================
    function sendSOS() {
        status.innerText = "🚨 SOS Activated";

        // Vibration (mobile only)
        if (navigator.vibrate) {
            navigator.vibrate([500, 300, 500]);
        }

        speak("SOS activated. Help is on the way.");

        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

                const message = encodeURIComponent(
                    `🚨 EMERGENCY SOS 🚨
I need immediate help!
📍 Location: ${mapsLink}`
                );

                status.innerText = "📍 Sending alerts...";

                // ✅ WhatsApp → FIRST contact only
                window.open(
                    `https://wa.me/${emergencyContacts[0]}?text=${message}`,
                    "_blank"
                );

                // ✅ SMS → ALL contacts
                emergencyContacts.forEach(phone => {
                    setTimeout(() => {
                        window.location.href =
                            `sms:${phone}?body=EMERGENCY! Location: ${mapsLink}`;
                    }, 1000);
                });

                // Emergency Call (India - 112)
                setTimeout(() => {
                    window.location.href = "tel:112";
                }, 2000);
            },
            () => {
                status.innerText = "❌ Location permission denied";
            }
        );
    }

});




