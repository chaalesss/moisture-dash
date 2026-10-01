# Moisture-Dash

A web application application that runs on Raspberry Pi for adding plants and monitoring their moisture through moisture sensors attached to the Raspberry Pi, the application runs on a Python backend using a flask library. It is not at a current state where it can be used as a fully working application, it's just a proof of concept that Python can be used as a backend

## Getting started

### Prerequisites

- A Raspberry Pi 5 with Ubuntu Server or any other Debian based Linux Distro
- An MCP3008 Microchip wired up to the Pi on a breadboard
- Capacitive Soil 2.0.0 moisture sensors connected to the MCP3008 channels (you can find them here: [](https://thepihut.com/products/capacitive-soil-moisture-sensor?variant=32137736421438&country=GB&currency=GBP&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gad_campaignid=11673057096&gbraid=0AAAAADfQ4GGfXd-Q6EcTrRtpYx0sD_aVy&gclid=CjwKCAjwifjVBhBKEiwAYx4K9Liytz59oILRDi6OLtQSTe5LhvIezgZoHDDL8-lYNhbBKRml0fdCFxoCL8YQAvD_BwE))

> [!NOTE]
> If you don't own one or more of these requirements, there is a mode which can be run without the need for the Raspberry Pi or Moisture Sensors. This is a debug mode which can also be used to take the MCP3008 and moisture sensors out of the equation which could be useful for anyone trying to figure out whats wrong.
>
> Wiring the MCP3008 can be hard, you can find a guide on how to wire it to the Raspberry Pi with this link:
>
> [MCP3008 Wiring Guide](https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#wire-mcp3008-raspberry-pi)
>
> To wire the Capacitive soil moisture sensor, you need to wire it like this:
>
> - VCC (Voltage): Connect this pin to the 5V output of your microcontroller or external power source.
> - GND (Ground): Connect this pin to the ground (GND) of your microcontroller.
> - AOUT (Analog Output): Connect this pin to an analog input pin on your MCP3008
>
> Refer to the pin diagram and table for the MCP3008 to wire it correctly found here:
>
> [MCP3008 Pin Diagram](https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#introducing-mcp3008)

### Downloading and the application

Downloading and getting the application working is fairly simple, start by downloading the ZIP file from the 'Code' button, then extract the files into a separate folder on your computer.

For example, create a folder in your documents folder called 'moisture-dash' and then extract the contents of ZIP file there.

> [!WARNING]
> **DO NOT** try to run any of the python files individually using the 'python' command, you will only run into errors and make it harder for yourself.

### Running the application

Open up a new terminal and start by navigating inside the folder where you extracted the files to using the command

```bash
cd /path/to/application/folder
```

then you need to run the file called `run.sh` using whichever shell you use normally

#### If you have a Raspberry Pi fully setup with the moisture sensors

You need to run the main run shellscript

**Bash:**

```bash
bash run.sh
```

**Zsh:**

```bash
zsh run.sh
```

#### If you are on MacOS, don't have any of the requirements or are trying to debug the application

you need to run the debug shellscript

**Bash:**

```bash
bash run_dbg.sh
```

**Zsh:**

```bash
zsh run_dbg.sh
```

#### If you're on Windows

I made a Powershell script to run the debug version, I haven't tested it out but you can run it by simply double clicking `run_dbg.ps1` in the file explorer.

If everything is working correctly, your command line should return something like:

```bash
Starting Flask server...
 * Serving Flask app 'backend/dashboard_main.py'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

This means that everything has installed properly and you can now access the website.

## Using the website

The important part of that output from before that we need to focus on here is:

```bash
* Running on http://127.0.0.1:5000
```

This tells us which IP and port the application is running on. by default, the IP will be 0.0.0.0 (listens on all network interfaces) and the port will be 5000.

**If you want to change the IP and port**, navigate the the backend folder and open the python file called `dashboard_main.py` in your text editor. Then scroll all the way down to the bottom until you find this block of code:

```python
if __name__ == "__main__":
    # Change host IP and port here (Default: host='127.0.0.1', port='5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
```

Here you can change the `host` and `port` variables, if port 5000 is occupied, change it to another port between 5000 and 6000

**You have two options for the `host` variable**:

1. **`127.0.0.1`** - Listens on only localhost, meaning the website can only be accessed from the device that the server is running on. This is the IP that you will put into your search bar.
2. **`0.0.0.0`** - Listens on all network interfaces, this will show up as your routers IP when you run the application, which is the IP that you will put into your search bar, and it means that other devices that are on the same network can connect the the website.

> [!IMPORTANT]
> Make sure to save and overwrite the changes if you change either of these variables

---

Now, go to your browser of choice and type:

https://{your.chosen.ip.here}:{your chosen port here}

If everything is working properly, this should direct you to a login page. You wont have an account yet, but you can create one by clicking the green register button in the top right of the navbar, or by clicking the link that says 'Don't have an account? Register'.

Once you have created an account and logged in, you will now be able to view the main dashboard, where you can add and monitor plants.

## How the application works

Moisture dash runs locally on the Raspberry Pi 5 as a web application, it uses python + flask as a backend. an SQL database is used to store user information and plant information safely and securely.

Flask is a lightweight WSGI web application framework that runs on python, this allows it to use python as a backend language for the website, and this is where all the processing for the moisture sensor happens before it is sent to the application.

You can read more about Flask and how it works using the link below:

[Welcome to Flask - Flask Documentation (3.1.x)](https://flask.palletsprojects.com/en/stable/)

Flask has many different libraries and applications built in which can help with the development of a website, you can import whatever you need from Flask along with the base framework, so you are'nt importing anything unnecessary.

While building my application, I imported multiple different Flask modules related to logins, SQL and user handling:

```python
from flask import Flask, render_template, jsonify, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, IntegerField
from wtforms.validators import InputRequired, Length, ValidationError, NumberRange
from flask_bcrypt import Bcrypt
```

## What each of these libraries do

To understand what's going on here, I will explain some of the most important libraries that have been imported

**`render_template`**: Instead of having to write every single HTML page inside of the return statement of the app route in Python, `render_template` allows you to instead return a template from dedicated HTML file located in a folder called "templates", making the backend script overall much cleaner.

**`url_for`**: Instead of hardcoding URL's which can load to problems down the line if/when you change the structure of the project or where the app is hosted, `url_for` automatically generates those paths for you by their name.

**For example** if you have a hardcoded route:

```python
@app.route("/users/<int:user_id>")
def profile(user_id):
    return f'<a href="/users/{user_id}/settings">Settings</a>' # The example hardcoded route.

@app.route("/users/<int:user_id>/settings")
def settings(user_id):
    return f"Settings for user {user_id}"
```

This works, until you rename the settings route:

```python
@app.route("/account/<int:user_id>/settings") # Route changed from "/users" to "/account" 
def settings(user_id):
    return f"Settings for user {user_id}"
```

Now you have to find and update every `"users/<int:user_id>/settings"` string manually.

If we use `url_for`:

```python
from flask import url_for

@app.route("/users/<int:user_id>")
def profile(user_id):
    settings_url = url_for("settings", user_id=user_id) # Assign url_for settings route with the user_id variable to settings_url
    return f'<a href="{settings_url}">Settings</a>' # Add the url_for variable in the href.

@app.route("/account/<int:user_id>/settings")
def settings(user_id):
    return f"Settings for user {user_id}"
```

Now, even if the route for `"settings"` is changed in the future, it wil still always return the working page, unless the endpoint/function name is changed.

---

**`SQLAlchemy`**: Flask library that allows python to search and manipulate SQL data, this means that instead of storing user info in a JSON, we can store it in and SQL table and allow python to search that table for the user information, and add or remove information from the table if needed.

**`FlaskForm`**: Flask-specific subclass of WTForms, which is a library for defining form field and validating submitted form data. It allows us to define a form and all of its input validation just once in Python and then render the form in the template and let it validate.

**For example:**

We can start by defining the form in the Flask app:

```python
class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={'placeholder': 'Username'})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={'placeholder': 'Password'})
    
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username = username.data).first()
        if existing_user_username:
            flash('That username already exists, please choose a different username', 'danger')
            raise ValidationError(
                "That username already exists, please choose another one")
```

And then render it inside of the HTML template:

```html
<form method="POST" action="" class="d-flex flex-column align-items-center">
    {{ form.hidden_tag() }}
    <div class="mb-3 w-75 text-center">
        {{ form.username(class='form-control') }}
    </div>
    <div class="mb-3 w-75 text-center">
        {{ form.password(class='form-control') }}
    </div>
    <div class="mb-3 w-75 text-center">
        {{ form.submit(class='btn btn-primary w-75') }}
    </div>
</form>
```

The information can then be checked within the `/login` route:

```python
@app.route("/login", methods = ['GET', 'POST'])
def login():
    logout_user()
    # Pass this variable into the render template then the form can be easily created in the HTML
    form = LoginForm()
    
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)                
                return redirect(url_for('index'))
            else:
                flash('Login failed: Password is incorrect', 'danger')
        else:
            flash('Login failed: Incorrect username or username does not exist', 'danger')
            
    return render_template('login.html', form=form)
```

---

**`Bcrypt`**: A cryptography library that allows you to generate and check hashes for your passwords, making sure that all passwords are stored safely and securely.
