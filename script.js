document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("sosBtn");
    const status = document.getElementById("status");

    let timer;
    let countdownInterval;
    let isTriggered = false;

    const emergencyContacts = ["916398758826"];

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
            status.innerText = count > 0 ? `Sending in ${count}...` : "🚨 Sending NOW!";

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

        navigator.geolocation.getCurrentPosition(
            position => {
                const mapsLink = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

                const message = encodeURIComponent(
`🚨 *EMERGENCY SOS ALERT* 🚨

I need immediate help.

📍 *Live Location:*
${mapsLink}

Please respond immediately.`
                );

                window.open(`https://wa.me/${emergencyContacts[0]}?text=${message}`);

                status.innerText = "✅ Alert Sent";
            },
            () => {
                status.innerText = "❌ Location denied";
                isTriggered = false;
            }
        );
    }

});