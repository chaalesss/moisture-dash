[← Back to the README](../README.md)

# How the application works

Moisture dash runs locally on the Raspberry Pi 5 as a web application, it uses python + flask as a backend. An SQL database is used to store user information and plant information safely and securely.

Flask is a lightweight WSGI web application framework that runs on python, this allows it to use python as a backend language for the website, and this is where all the processing for the moisture sensor happens before it is sent to the application.

You can read more about Flask and how it works using the link below:

[Welcome to Flask - Flask Documentation (3.1.x)](https://flask.palletsprojects.com/en/stable/)

Flask has many different libraries and applications built in which can help with the development of a website, you can import whatever you need from Flask along with the base framework, so you aren't importing anything unnecessary.

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

**`render_template`**: Instead of having to write every single HTML page inside the return statement of the app route in Python, `render_template` allows you to instead return a template from dedicated HTML file located in a folder called "templates", making the backend script overall much cleaner.

**`url_for`**: Instead of hard-coding URLs which can load to problems down the line if/when you change the structure of the project or where the app is hosted, `url_for` automatically generates those paths for you by their name.

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

And then render it inside the HTML template:

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
