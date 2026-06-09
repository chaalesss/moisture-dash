// get table elements
const table_body = document.getElementById("plant-table-body");

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
let selected_row = null;

// fetch records based from search args
async function fetch_plants() {
    try {
        // fetch json data
        const response = await fetch(`/api/plantinfo`);
        const data = await response.json();
        
        console.log(data);
        
        // run the data through an insertion sort algorithm
        let sorted_data = sort_plants(data);
        
        const table_body = document.getElementById("plant-table-body");

        table_body.innerHTML = ""

        sorted_data.forEach(plant => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${plant.name}</td>
                <td>${plant.species}</td>
                <td>${plant.moisture_data.moisture}</td>
                <td>${plant.moisture_data.raw_value}</td>
                <td>${plant.sensor}</td>
            `;

            row.style.cursor = 'pointer';

            row.addEventListener('click', () => {
                
                selected_plant_id = plant.id;
                selected_plant_name = plant.name;

                console.log(selected_plant_id);

                selected_row = row;

                modal_text.textContent = `Delete plant: ${plant.name}? This action cannot be undone.`;

                delete_toast.hide()
                modal.show();
                
                return plant.name;
            })

            table_body.appendChild(row);
        });
    } catch (error) {
        console.error(`Error: ${error} JSON file may be empty`)
    }    
}

// use an insersion sort to sort the plants by alphabetical order
function sort_plants(arr) {
    // start loop at index 1
    for (let i = 1; i < arr.length; i++) {

        // pick the current item
        let key = arr[i];
        let j = i - 1;

        // compare backwards based on name (alphabetical order) and shift elements
        while (j >=0 && arr[j].name.toLowerCase() > key.name.toLowerCase()) {
            arr[j + 1] = arr[j];
            j--;
        }

        // insert key into the correct position
        arr[j + 1] = key;
    }

    return arr;
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

        if (selected_row) {
            selected_row.remove();
        }

        toast_body.textContent = `${selected_plant_name} deleted successfully.`;

        modal.hide();
        delete_toast.show();
    } catch(error) {
        console.error(error)
    }

    selected_plant_id = null;
    selected_row = null;
});
fetch_plants();