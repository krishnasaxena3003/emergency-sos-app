document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("sosBtn");
    const status = document.getElementById("status");

    let timer;
    let countdownInterval;
    let isTriggered = false;

    const emergencyContacts = [
        "916398758826"
    ];

    function speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    function startPress(e) {
        e.preventDefault();

        if (isTriggered) return;

        status.innerText = "Hold...";

        btn.style.transform = "scale(0.92)";
        btn.style.boxShadow = "0 0 10px red";

        timer = setTimeout(startCountdown, 1000);
    }

    function cancelPress() {
        clearTimeout(timer);
        clearInterval(countdownInterval);

        status.innerText = "";

        btn.style.transform = "scale(1)";
        btn.style.boxShadow = "";
    }

    btn.addEventListener("pointerdown", startPress);
    btn.addEventListener("pointerup", cancelPress);
    btn.addEventListener("pointerleave", cancelPress);

    function startCountdown() {
        let count = 2;
        status.innerText = `Sending in ${count}...`;

        btn.style.boxShadow = "0 0 30px red";

        countdownInterval = setInterval(() => {
            count--;

            if (count > 0) {
                status.innerText = `Sending in ${count}...`;
            } else {
                status.innerText = "🚨 Sending NOW!";
            }

            if (count === 0) {
                clearInterval(countdownInterval);
                setTimeout(sendSOS, 300);
            }
        }, 700);
    }

    function sendSOS() {
        if (isTriggered) return;
        isTriggered = true;

        status.innerText = "📡 Getting location...";

        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500]);
        }

        speak("Emergency activated. Sending your location.");

        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

                if (!navigator.onLine) {
                    status.innerText = "❌ No internet connection";
                    isTriggered = false;
                    return;
                }

                const message = encodeURIComponent(
`🚨 *EMERGENCY SOS ALERT* 🚨

I need immediate help.

📍 *Live Location:*
${mapsLink}

🕒 Sent just now

Please respond or call me immediately.`
                );

                status.innerText = "📍 Sending alert...";

                window.open(
                    `https://wa.me/${emergencyContacts[0]}?text=${message}`,
                    "_blank"
                );

                setTimeout(() => {
                    window.location.href = "tel:112";
                }, 3000);

                status.innerText = "✅ Alert Sent";

                btn.style.transform = "scale(1)";
                btn.style.boxShadow = "";
            },
            () => {
                status.innerText = "❌ Location denied";
                isTriggered = false;

                btn.style.transform = "scale(1)";
                btn.style.boxShadow = "";
            },
            { timeout: 10000 }
        );
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

});