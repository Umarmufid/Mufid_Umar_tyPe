document.addEventListener("DOMContentLoaded", function () {
    const timerElement = document.getElementById("timer");
    const textDisplay = document.getElementById("text-display");
    const textInput = document.getElementById("text-input");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const errorsElement = document.getElementById("errors");
    const timeElement = document.getElementById("time");
    const canvas = document.getElementById("speedChart");
    const textSelect = document.getElementById("text-select"); // Matn tanlash elementi
    let ctx = canvas.getContext("2d");

    let startTime = null;
    let interval = null;
    let errors = 0;
    let chart;

    // Matnlar ro'yxati
    const texts = [
        "Salom! Bugun qanday ishlar?",
        "O'zbekiston Respublikasi poytaxti Toshkent shahri hisoblanadi.",
        "Dasturlash bu kelajak kasblaridan biri hisoblanadi.",
        "Hayotda hech qachon taslim bo'lma!"
    ];

    // Matn tanlash opsiyalarini qo'shish
    texts.forEach((text, index) => {
        let option = document.createElement("option");
        option.value = text;
        option.textContent = `Matn ${index + 1}`;
        textSelect.appendChild(option);
    });

    // Foydalanuvchi tanlagan matnni ekranga chiqarish
    textSelect.addEventListener("change", function () {
        textDisplay.textContent = this.value;
        textInput.value = "";
        resetTest();
    });

    textInput.addEventListener("input", function () {
        if (!startTime) {
            startTime = new Date().getTime();
            interval = setInterval(updateTimer, 1000);
        }
        checkTyping();
    });

    function updateTimer() {
        let currentTime = new Date().getTime();
        let seconds = Math.floor((currentTime - startTime) / 1000);
        timerElement.textContent = `Vaqt: ${seconds}s`;
    }

    function checkTyping() {
        let inputText = textInput.value;
        let originalText = textDisplay.textContent;
        let formattedText = "";
        errors = 0;

        for (let i = 0; i < originalText.length; i++) {
            if (i < inputText.length) {
                if (inputText[i] === originalText[i]) {
                    formattedText += `<span style="color: white;">${originalText[i]}</span>`;
                } else {
                    formattedText += `<span style="color: red;">${originalText[i]}</span>`;
                    errors++;
                }
            } else {
                formattedText += `<span style="color: gray;">${originalText[i]}</span>`;
            }
        }

        textDisplay.innerHTML = formattedText;

        if (inputText === originalText) {
            clearInterval(interval);
            showResults();
        }
    }

    function showResults() {
        let totalTime = Math.floor((new Date().getTime() - startTime) / 1000);
        let wordsTyped = textDisplay.textContent.length / 5;
        let wpm = Math.round(wordsTyped / (totalTime / 60));
        let accuracy = Math.max(0, Math.round(((textDisplay.textContent.length - errors) / textDisplay.textContent.length) * 100));

        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy + "%";
        errorsElement.textContent = errors;
        timeElement.textContent = totalTime + "s";

        drawChart(wpm);
    }

    function drawChart(finalWpm) {
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["5s", "10s", "15s", "20s", "25s", "30s"],
                datasets: [{
                    label: "WPM",
                    data: [finalWpm - 10, finalWpm - 5, finalWpm - 3, finalWpm - 2, finalWpm - 1, finalWpm],
                    borderColor: "yellow",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function resetTest() {
        startTime = null;
        clearInterval(interval);
        timerElement.textContent = "Vaqt: 0s";
        wpmElement.textContent = "0";
        accuracyElement.textContent = "0%";
        errorsElement.textContent = "0";
        timeElement.textContent = "0s";
    }
});