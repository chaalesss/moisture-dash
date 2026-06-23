let last_timestamp=null
let moisture_chart;

async function fetch_history() {
    try {
        const response = await fetch(`/api/plant/${plantId}/history`);
        const data = await response.json();

        console.log(data);

        console.log("Chart exists:", moisture_chart);

        if (!moisture_chart) {
            create_chart(data);
        } else {
            update_chart(data);
        }
    } catch(error) {
        console.error(error);
    }
};

function create_chart(history) {
    console.log(`function create_chart run`)
    const ctx = document.getElementById('moisture-chart');

    // Doing this while tipsy so i'll see how well this turns out i guess
    // Sober me here: I infact managed to pull it off
    moisture_chart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: history.map(reading =>
                new Date(reading.time).toLocaleTimeString([], {
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            ),

            datasets: [{
                label: 'Soil Moisture (%)',

                data: history.map(
                    reading => reading.moisture
                )
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    })
};

function update_chart(history) {
    const latest = history[history.length - 1];

    if (last_timestamp === latest.time) return;
    last_timestamp = latest.time;

    const formatted_time = new Date(latest.time).toLocaleTimeString([], {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const dataset = moisture_chart.data.datasets[0];

    // remove old + add placeholder
    moisture_chart.data.labels.push(formatted_time);
    dataset.data.push(0);

    const max_points = 10;

    if (moisture_chart.data.labels.length > max_points) {
        moisture_chart.data.labels.shift();
        dataset.data.shift();
    }

    // update without animation
    moisture_chart.update('none');

    // next frame >>> grow bar
    requestAnimationFrame(() => {
        dataset.data[dataset.data.length - 1] = latest.moisture;

        moisture_chart.update({
            duration: 500,
            easing: 'easeOutCubic'
        });
    });
};

window.addEventListener("DOMContentLoaded", () => {
    setInterval(fetch_history, 2500)
    fetch_history();   // creates chart immediately
});