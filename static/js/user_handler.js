async function load_user() {
    try{
        const response = await fetch('/api/userinfo');
        const data = await response.json();

        console.log(data);

        if (data.logged_in === true) {
            console.log(`If statement for data.logged_in passed with true`);

            const account_section = document.getElementById('loginreg-btn');

            account_section.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${data.username}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="/dashboard">Account Dashboard</a></li>
                    <li><a class="dropdown-item" href="/logout">Logout</a></li>
                </ul>
            </li>
            `;
        } else {
            console.log(`If statement for data.logged_in passed with false`)
        }
    }
    catch (error) {
        console.error(`Error: ${error} Json file may be Empty`)
    }
}
load_user();
