const starter_text = document.getElementById('starter-text')

let plants = [];

function render_grid(data) {
    try{
        const grid = document.getElementById('plant-grid');
        grid.innerHTML = '';

        data.forEach(plant => {
            grid.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card plant-card h-100 shadow"
                    onclick="openPlant(${plant.id})"
                    style="cursor:pointer">
                    <div class="card-body text-center">
                        <h1>${plant.name}</h1>
                        <p>${plant.species}</p>
                        <hr>
                        <h2>Moisture Level</h2>
                        <h3>${plant.moisture_data.moisture}%</h3>
                        <small>
                            Raw: ${plant.moisture_data.raw_value}
                        </small>
                    </div>
                </div>
            </div>`
        });
    } catch (error) {
        console.error(error)
    }
}

function openPlant(id) {
    window.location.href = `/plant/${id}`
}

async function load_plants() {
    try {
        const response = await fetch("/api/plantinfo");
        const data = await response.json();

        if(data!='') {
            console.log(data);
            starter_text.innerHTML='';
            render_grid(data);
        } else {
            throw new Error('Json file empty')
        };
        
    } catch (error) {
        console.error(error)
    }
}
load_plants();
setInterval(load_plants, 2500);