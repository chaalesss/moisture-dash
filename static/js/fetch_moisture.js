async function load_moisture() {
    try {
        const response = await fetch("/api/moisture");
        const data = await response.json();

        console.log(data);

        document.getElementById("raw-value").textContent = data.raw_value;
        document.getElementById("moisture-value").textContent = data.moisture + "%";
    } catch (error) {
        console.error("Failed to load moisture data:", error);
    }
}

load_moisture();
setInterval(load_moisture, 2500);