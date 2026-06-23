const starter_text = document.getElementById('starter-text')

let plants = [];

function render_grid(data) {
    try{
        const grid = document.getElementById('plant-grid');
        grid.innerHTML = '';

        data.forEach(plant => {

            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-3')

            col.innerHTML = `
            <div class="card plant-card h-100 shadow">

                <div class="glare"></div>

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
            `;

            const card = col.querySelector('.plant-card');
            const glare = col.querySelector('.glare');

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();

                glare.style.setProperty('--x', `${e.clientX - rect.left}px`);
                glare.style.setProperty('--y', `${e.clientY - rect.top}px`);
            });

            card.addEventListener('mouseleave', () => {
                glare.style.setProperty("--x", "-100px");
                glare.style.setProperty("--y", "-100px");
            });

            col.style.cursor = 'pointer';

            col.addEventListener('click', () => {
                openPlant(plant.id)
            })

            grid.appendChild(col);
        });

        document.querySelectorAll(".plant-card").forEach(card => {
            const glare = card.querySelector(".glare");

            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();

                glare.style.setProperty("--x", `${e.clientX - rect.left}px`);
                glare.style.setProperty("--y", `${e.clientY - rect.top}px`);
            });
        });

        card.addEventListener("mouseleave", () => {
            glare.style.setProperty("--x", "-100px");
            glare.style.setProperty("--y", "-100px");
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