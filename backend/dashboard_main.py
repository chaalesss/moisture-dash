# import flask libraries
from flask import Flask, render_template, jsonify, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, IntegerField
from wtforms.validators import InputRequired, Length, ValidationError, NumberRange
from flask_bcrypt import Bcrypt

# import other misc libraries
import pathlib
import os
import pymysql
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

# Check for debug mode
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
    
if DEBUG:
    #import random for random value gen
    import random 
    
    plant_values = {} # Where the dummy data is stored so it gives the illusion that each plant has its own seperate data

    DRY_VALUE = 850   # sensor value when soil is completely dry
    WET_VALUE = 350   # sensor value when soil is very wet
    
    # generate dummy values for the sake of testing, making a rpi and moisture sensor not needed
    def generate_value(value):
        increment = random.randint(-50, 50)
        value += increment
        value = max(350, min(value, 850))
        return value
        
    def percent(value):
        percent = (DRY_VALUE - value) / (DRY_VALUE - WET_VALUE) * 100
        percent = max(0, min(100, percent))  # clamp 0–100
        return int(percent)
    
    def sensor_job(app):
        print('Job ran at', datetime.now(timezone.utc))
        with app.app_context():
            for plant in Plants.query.all():
                # initialise if missing
                if plant.id not in plant_values:
                    plant_values[plant.id] = random.randint(350, 850)
                # simulate sensor change
                new_value = generate_value(plant_values[plant.id])
                plant_values[plant.id] = new_value
                # save to history
                reading = MoistureHistory(
                    plant_id=plant.id,
                    raw_value=new_value,
                    moisture_percent=percent(new_value),
                )
                db.session.add(reading)
            db.session.commit()
            
            cutoff = datetime.now(timezone.utc) - timedelta(minutes=1, seconds=30)
            
            MoistureHistory.query.filter(
                MoistureHistory.timestamp < cutoff
            ).delete()
            db.session.commit()

else:
    # import sensor data
    from sensor_main import get_moisture_data
    
    def sensor_job(app):
        print('Job ran at', datetime.now(timezone.utc))
        with app.app_context():
            #unpack moisture data
            moisture_data = get_moisture_data(plant.sensor)
            for plant in Plants.query.all():
                # save to history
                reading = MoistureHistory(
                    plant_id=plant.id,
                    raw_value=moisture_data['raw_value'],
                    moisture_percent=moisture_data['moisture'],
                )
                db.session.add(reading)
            db.session.commit()
            
            cutoff = datetime.now(timezone.utc) - timedelta(days=7)
            
            MoistureHistory.query.filter(
                MoistureHistory.timestamp < cutoff
            ).delete()
            db.session.commit()

BASE_DIR = pathlib.Path(__file__).parent
app = Flask(__name__, template_folder=os.path.join(BASE_DIR, "../templates"), static_folder=os.path.join(BASE_DIR, "../static"))
bcrypt = Bcrypt(app)

# -------- SQL DATABASE --------
# set base directory for database
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://moisture_user:moisture_pass@localhost/moisture_dashboard'
)
app.config['SECRET_KEY'] = 'tempkey123' # This key isnt securing shit
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = None

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20), nullable = False, unique = True)
    password = db.Column(db.String(80), nullable = False)
    
    plants = db.relationship('Plants', backref='owner', lazy=True)
    
class Plants(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20))
    species = db.Column(db.String(20))
    sensor = db.Column(db.Integer)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
class MoistureHistory(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    raw_value = db.Column(db.Integer, nullable = False)
    moisture_percent = db.Column(db.Integer, nullable = False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'), nullable = False)
    
    plant = db.relationship('Plants', backref = db.backref('moisture_history', cascade = 'all, delete-orphan'))

# -------- FORMS --------
# Register
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

# Login        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={'placeholder': 'Username'})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={'placeholder': 'Password'})
    
    submit = SubmitField('Login')
    
# Add Plant
class AddPlantForm(FlaskForm):
    name = StringField(validators=[InputRequired(), Length(
        min = 4, max=20)], render_kw={'placeholder': 'Plant Name'})
    
    species = StringField(validators=[InputRequired(), Length(
        min = 4, max=20)], render_kw={'placeholder': 'Plant Species'})
    
    sensor = IntegerField(validators=[InputRequired(), NumberRange(
        min=0, max=5)], render_kw={'placeholder': 'Sensor Number'})
    
    submit = SubmitField('Add Plant')
    
    def validate_sensor(self, sensor):
        existing_sensor_assignment = Plants.query.filter_by(
            sensor = sensor.data, user_id=current_user.id).first()
        if existing_sensor_assignment:
            flash('This sensor is already assigned to another plant, please choose a different sensor.', 'danger')
            raise ValidationError(
                'Sensor is already assigned to another plant, please pick another sensor')


# -------- MAIN APP --------
# Welcome to app routing spaghetti noodle hell...

# Seet up moisture history job
if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    scheduler = BackgroundScheduler()

    if DEBUG:
        scheduler.add_job(
            func=sensor_job,
            trigger='cron',
            second='*/10',
            args=[app],
            max_instances=1, # Prevents overlapping runs
            coalesce=True # Skips backlog if it lags
        )

    else:
        scheduler.add_job(
            func=sensor_job,
            trigger='cron',
            hour=6, #Every 6 hours
            minute=0, 
            second=0,
            args=[app],
            max_instances=1, # Prevents overlapping runs
            coalesce=True # Skips backlog if it lags
        )

    scheduler.start()

@app.route("/")
@login_required
def index():
    return render_template("index.html")

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

@app.route('/api/userinfo')
# Store user info in json file which can then be fetched on the frontend to display account info
def store_user_info():
    if not current_user.is_authenticated:
        return jsonify({"logged_in": False})

    user = User.query.get(current_user.id)

    if not user:
        logout_user()
        return jsonify({"logged_in": False})

    return jsonify({
        "logged_in": True,
        "username": user.username,
    })

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, password=hashed_password) 
        db.session.add(new_user)
        db.session.commit()
        flash('Account successfully created', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    session.clear()
    return redirect(url_for('login'))

@app.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    form = AddPlantForm()
    
    if form.validate_on_submit():
        new_plant = Plants(name=form.name.data, species=form.species.data, sensor=form.sensor.data, user_id=current_user.id)
        db.session.add(new_plant)
        db.session.commit()
        flash(f'{new_plant.name} Added', 'success')
        return redirect(url_for('add'))
    
    return render_template('add.html', form=form)

@app.route('/delete')
@login_required
def delete():
    return render_template('delete.html')

@app.route('/api/delete', methods=['DELETE'])
@login_required
def delete_plant():
    plant_id = request.args.get('plant_id', type=int)
    
    plant = db.session.get(Plants, plant_id)
    
    if not plant:
        return {'error': 'Student not found'}, 404
    
    if plant.user_id != current_user.id:
        return {'error': 'Unauthorised'}, 403
    
    db.session.delete(plant)
    db.session.commit()
    
    return {'message': 'Deleted successfully'}

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

if DEBUG:
    @app.route('/api/plantinfo')
    def store_plant_info():
        plants = Plants.query.filter_by(user_id=current_user.id).all()
        
        # Generate dummy values for the sake of testing, meaning the raspberry pi and moisture sensors aren't needed
        for plant in plants:
            
            # generate a random val for each plant id
            if plant.id not in plant_values:
                plant_values[plant.id] = random.randint(350, 850)
                
            plant_values[plant.id] = generate_value(plant_values[plant.id])

        return jsonify([
            {
                'id': plant.id,
                'name': plant.name,
                'species': plant.species,
                'moisture_data': {
                    'raw_value': plant_values[plant.id],
                    'moisture': percent(plant_values[plant.id])
                },
                'sensor': plant.sensor
            }
            for plant in plants
        ])

else:
    @app.route('/api/plantinfo')
    def store_plant_info():
        plants = Plants.query.filter_by(user_id=current_user.id).all()

        return jsonify([
            {
                'id': plant.id,
                'name': plant.name,
                'species': plant.species,
                'moisture_data': get_moisture_data(plant.sensor),
                'sensor': plant.sensor
            }
            for plant in plants
        ])

@app.route('/plant/<int:plant_id>')
@login_required
def plant(plant_id):
    plant = Plants.query.filter_by(id=plant_id).first()
    return render_template('plant.html', plant_id=plant_id, plant_name=plant.name)

if DEBUG:
    @app.route('/api/plant/<int:plant_id>')
    @login_required
    def plant_single(plant_id):
        plant = Plants.query.filter_by(id=plant_id).first()
        
        if plant.id not in plant_values:
            plant_values[plant.id] = random.randint(350, 850)
            
        plant_values[plant.id] = generate_value(plant_values[plant.id])
        
        plant_info = {
            'id': plant.id,
            'name': plant.name,
            'species': plant.species,
            'moisture_data': {
                'raw': plant_values[plant.id],
                'moisture': percent(plant_values[plant.id])},
            'sensor': plant.sensor
        }
        
        print(plant_info)
        
        return jsonify(plant_info)

else:
    @app.route('/api/plant/<int:plant_id>')
    @login_required
    def plant_single(plant_id):
        plant = Plants.query.filter_by(id=plant_id).first()
        
        plant_info = {
            'id': plant.id,
            'name': plant.name,
            'species': plant.species,
            'moisture_data': get_moisture_data(plant.sensor),
            'sensor': plant.sensor
        }
        print(plant_info)
        
        return jsonify(plant_info)

@app.route('/api/plant/<int:plant_id>/history')
@login_required
def store_history(plant_id):
    history = MoistureHistory.query\
        .filter_by(plant_id=plant_id)\
        .order_by(MoistureHistory.timestamp.asc())\
        .all()
        
    history_data = []
    
    for reading in history:
        history_data.append({
            'time': reading.timestamp,
            'raw': reading.raw_value,
            'moisture': reading.moisture_percent
        })
        
    return jsonify(history_data)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)