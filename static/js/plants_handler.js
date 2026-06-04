async function load_plants() {
    try{
        const response = await fetch('/api/plantinfo');
        const data = await response.json();

        console.log(data)
    }
    catch(error) {
        console.error(error)
    }
}