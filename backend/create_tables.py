# Extremely simple program lol, all it does is create the tables in the db file if the db file didnt exist beforehand
from dashboard_main import app, db

with app.app_context():
    db.create_all()
    
print('Tables Created')