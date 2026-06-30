console.log('img_upload.js loaded');
const drop_area = document.getElementById('drop-area');
const input_file = document.getElementById('input-file');

const upload_placeholder = document.getElementById('upload-placeholder');
const image_preview = document.getElementById('image-preview');
const plant_image = document.getElementById('plant-image-preview');

const change_button = document.getElementById('change-image');
const delete_button = document.getElementById('delete-image');

const plant_id = document.body.dataset.plantId;

change_button.addEventListener('click', () => {
    input_file.click();
});

input_file.addEventListener("change", upload_image);

async function upload_image() {
    console.log("upload_image called");

    if (plant_image.src && !plant_image.src.endsWith(window.location.href)) {
        try {
            const response = await fetch(`/delete-image/${plant_id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.error) {
                console.error('Delete failed', data.error);
                return;
            }
            plant_image.src = '';
            image_preview.classList.add('d-none');
            document.getElementById('image-buttons').classList.add('d-none');
            upload_placeholder.classList.remove('d-none');
        } catch (error) {
            console.error('Delete error:', error);
            return;
        }
    }

    const file = input_file.files[0];
    console.log("File:", file);
    if (!file) return;

    // Temporary preview before upload finishes
    plant_image.src = URL.createObjectURL(file);
    upload_placeholder.classList.add("d-none");
    image_preview.classList.remove("d-none");
    document.getElementById('image-buttons').classList.remove("d-none");

    let form_data = new FormData();
    form_data.append("image", file);

    fetch(`/upload-image/${plant_id}`, {
        method: "POST",
        body: form_data
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Upload failed:", data.error);
            return;
        }
        plant_image.src = `/static/uploads/${data.filename}`;
        console.log("Upload response:", data);
    })
    .catch(error => {
        console.error("Upload error:", error);
    });
};

delete_button.addEventListener('click', delete_image)

function delete_image() {
    fetch(`/delete-image/${plant_id}`, {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Delete failed`, data.error);
            return;
        }

        plant_image.src = '';
        image_preview.classList.add('d-none');
        document.getElementById('image-buttons').classList.add('d-none');
        upload_placeholder.classList.remove('d-none');
    })
    .catch(error => console.error('Delete error:', error));
}