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
}

function create_chart(history) {
    console.log(`function create_chart run`)
    const ctx = document.getElementById('moisture-chart');

    // Doing this while tipsy so i'll see how well this turns out i guess
    moisture_chart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: history.map(
                reading => reading.time
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

function update_chart(history){

    moisture_chart.data.labels =
        history.map(x => x.time);

    moisture_chart.data.datasets[0].data =
        history.map(x => x.moisture);

    moisture_chart.update();
}
window.addEventListener("DOMContentLoaded", () => {
    setInterval(fetch_history, 2500)
    fetch_history();   // creates chart immediately
});