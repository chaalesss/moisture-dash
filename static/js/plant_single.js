// Get elements for the plant info card
const plant_name = document.getElementById('plant-name');
const plant_species = document.getElementById('plant-species')
const moisture_percent = document.getElementById('moisture-percent');
const raw_value = document.getElementById('raw-value');
const plant_status = document.getElementById('plant-status');
const last_watered = document.getElementById('last-watered');
const plantId = document.body.dataset.plantId;

// get the plant info
async function fetch_plant() {
    try {
        const response = await fetch (`/api/plant/${plantId}`);
        const data = await response.json();

        console.log(data);

        card_info(data);
    } 
    catch (error) {
        console.error(error)
    }
};

// load all info into the left card
function card_info(data) {
    try{
        plant_name.textContent = data.name;
        plant_species.innerHTML = `<strong>Species:</strong> ${data.species}`;
        moisture_percent.innerHTML = `<strong>Moisture:</strong> ${data.moisture_data.moisture}%`;
        raw_value.innerHTML = `<strong>Raw Value:</strong> ${data.moisture_data.raw_value}`;
        
        // This displays the plants condition based on a few different moisture ranges
        if (data.moisture_data.moisture < 25) {
            plant_status.innerHTML = `
            <strong>Status:</strong>
            <span class="badge bg-danger">Very Dry</span>`
        } else if (data.moisture_data.moisture >= 25 && data.moisture_data.moisture < 50) {
            plant_status.innerHTML = `
            <strong>Status:</strong>
            <span class="badge bg-warning">Dry</span>`
        } else if (data.moisture_data.moisture >= 50 && data.moisture_data.moisture <75) {
            plant_status.innerHTML = `
            <strong>Status:</strong>
            <span class="badge bg-info">Wet</span>`
        } else if (data.moisture_data.moisture >=75) {
            plant_status.innerHTML = `
            <strong>Status:</strong>
            <span class="badge bg-success">Sufficiently Watered</span>`
        }
    } catch (hands) {
        console.error(hands);
        throw hands // pissing myself this is too funny not to keep in
    }
}

fetch_plant();
setInterval(fetch_plant, 2500);
