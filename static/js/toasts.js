document.addEventListener('DOMContentLoaded', () => {
    const toastElements = document.querySelectorAll('.toast');

    toastElements.forEach(el => {
        new bootstrap.Toast(el, {
            autohide: true,
            delay: 3000
        }).show();
    });
});