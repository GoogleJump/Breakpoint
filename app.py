from functools import wraps
from flask import Flask, render_template, redirect, url_for, g, request, session
from flask.ext.mongoengine import MongoEngine
from flask.ext.security import Security, MongoEngineUserDatastore, \
        UserMixin, RoleMixin, login_required
from flask_oauth import OAuth
                    
# Create app
app = Flask(__name__)
# FIXME: Disable debug mode in prodoction!
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'replace_me_eventually'

# MongoDB config
#app.config['MONGODB_DB'] = 'mydatabase'
#app.config['MONGODB_HOST'] = 'localhost'
#app.config['MONGODB_PORT'] = 27017
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
    confirmed_at =db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

# Setup FLask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# OAuth stuff still under construction.
oauth = OAuth()
FACEBOOK_APP_ID = 'tbd'
FACEBOOK_APP_SECRET = 'tbd'

"""
https://pythonhosted.org/Flask-OAuth/
OAuth remote app configuraations.
"""
facebook = oauth.remote_app('facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=FACEBOOK_APP_ID,
    consumer_secret=FACEBOOK_APP_SECRET,
    request_token_params={'scope': 'email'}
    )
twitter = oauth.remote_app('twitter',
    base_url='https://api.twitter.com/1/',
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authenticate',
    consumer_key='<your key here>',
    consumer_secret='<your secret here>'
)

# Create a fake user to start with.
@app.before_first_request
def create_user():
    user_datastore.create_user(email='darylsew@gmail.com', password='password')

# Views
@app.route('/')
def home():
    #params = request.getParams()
    #lat = param['lat']
    #lon = param['lon']
    #amp = param['amp']
    #freq = param['freq']
    #database.add(lat, lon, amp, freq)
    return render_template('index.html')

@app.route('/recorder')
def audio():
    return render_template('recorder.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route("/test")
@login_required
def test():
    return render_template("test.html", worked="it worked!")

@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO figure out everything
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return render_template("login.html")

@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(port=9999)
