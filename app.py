from flask import Flask, render_template, redirect, url_for, g, request, session, jsonify
from flask.ext.mongoengine import MongoEngine
from flask.ext.security import Security, MongoEngineUserDatastore, \
        UserMixin, RoleMixin, login_required
from flask_oauth import OAuth
from urllib2 import urlopen
import json
from jinja2 import Template

# Note: To deal with potential username spoofing, check the username
# in the session with every action that actually does something
# ie creating a sound bite, deleting, etc
                    
# Create app
app = Flask(__name__)
# FIXME: Disable debug mode in prodoction!
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'replace_me_eventually'

# MongoDB config
# TODO load from file
app.config['MONGODB_SETTINGS'] = {
                                    'DB': 'mangoes', 
                                    'USERNAME' : 'breakpoint', 
                                    'PASSWORD' : 'googlejump', 
                                    'HOST' : 'kahana.mongohq.com', 
                                    'PORT': 10035 
                                    }

# Create database connection object
db = MongoEngine(app)

class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)

class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

class Bite(db.Document):
    centroids = db.ListField(db.FloatField(), default=list)
    volumes = db.ListField(db.FloatField(), default=list)
    location = db.GeoPointField()
    start_time = db.DateTimeField()
    duration = db.IntField()

#testBite = Bite(centroids=[1, 2], volumes=[1, 2], duration=0)
#testBite.save()

# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# Views
@app.route('/')
def home():
    return redirect(url_for('map'))

@app.route('/recorder')
def audio():
    return render_template('recorder.html')

@app.route('/map')
def map():
    logged_in = 'username' in session
    if logged_in:
        return render_template(
                'map.html', 
                logged_in='var logged_in = true;', 
                username='var username = "' + session['username'] + '"')
    else:
        return render_template('map.html', logged_in='var logged_in = false;')

@app.route('/upload')
def upload():
    #params = request.getParams()
    #lat = param['lat']
    #lon = param['lon']
    #amp = param['amp']
    #freq = param['freq']
    #database.add(lat, lon, amp, freq)
    return render_template('map.html')

@app.route('/delete')
def delete():
    return "still working on this!"

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user_datastore.create_user(email=email, password=str(hash(password)))
        return redirect(url_for('map'))
    # TODO figure out what to do here.
    # also TODO what happens in user already exists case?
    return "404"

@app.route('/userlogin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = user_datastore.get_user(username)
        if str(hash(password)) == user.password:
            session['username'] = username
            return redirect(url_for('map'))
        else:
            # TODO do something sensible
            return "404 incorrect password"
        session['username'] = request.form['username']
        return redirect(url_for('map'))
    elif request.method == 'GET':
        session['username'] = request.args.get('user')
        # when does it fail? idk
        return jsonify(success=True)
    else:
        return "what are you doing stop pls"
    # if it's a GET request, it should include the email in it.
    # not confident we want to do it that way but i guess it works
    #return render_template(url_for('map'))

@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('map'))


if __name__ == '__main__':
    app.run(port=9999)
