// get elements
const grid = document.getElementById("plant-grid");
starter_text = document.getElementById('starter-text')

// get modal elements and create new modal with bootstrap
const modal_element = document.getElementById('delete-modal');
const modal = new bootstrap.Modal(modal_element);

const modal_text = document.getElementById('modal-text');
const confirm_btn = document.getElementById('confirm-delete-btn')

const toast_element = document.getElementById('delete-toast');
const toast_body = document.getElementById('toast-body');
const delete_toast = new bootstrap.Toast(toast_element);

// define state variables
let selected_plant_id = null;
let selected_plant_name = null;
let selected_col = null;

// fetch records based from search args
async function fetch_plants() {
    try {
        // fetch json data
        const response = await fetch(`/api/plantinfo`);
        const data = await response.json();

        if (data != '') {
            starter_text.innerHTML='';
            
            console.log(data);
            
            const grid = document.getElementById("plant-grid");

            grid.innerHTML = ""

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
                    
                    selected_plant_id = plant.id;
                    selected_plant_name = plant.name;

                    console.log(selected_plant_id);

                    selected_col = col;

                    modal_text.textContent = `Delete plant: ${plant.name}? This action cannot be undone.`;

                    delete_toast.hide()
                    modal.show();
                    
                    return plant.name;
                })

                grid.appendChild(col);
            });
        }

    } catch (error) {
        console.error(`Error: ${error} JSON file may be empty`)
    }    
}

confirm_btn.addEventListener('click', async () => {

    console.log('Delete Button Clicked');

    if (!selected_plant_id) return;

    try {
        const response = await fetch(`/api/delete?plant_id=${selected_plant_id}`, {
            method: 'DELETE'
        });

        console.log(response.status);

        const result = await response.json();
        console.log(result);

        if (selected_col) {
            selected_col.remove();
        }

        toast_body.textContent = `${selected_plant_name} deleted successfully.`;

        modal.hide();
        delete_toast.show();
    } catch(error) {
        console.error(error)
    }

    selected_plant_id = null;
    selected_col = null;
});
fetch_plants();
setInterval(fetch_plants, 2500);