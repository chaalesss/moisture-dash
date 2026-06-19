let moisture_chart;

function create_chart() {
    console.log(`function create_chart run`)
    const ctx = document.getElementById('moisture-chart');

    const moisture_chart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: [
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun'
            ],

            datasets: [{
                label: 'Soil Moisture (%)',

                data: [
                    45,
                    52,
                    60,
                    48,
                    65,
                    70,
                    62
                ]
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
create_chart();