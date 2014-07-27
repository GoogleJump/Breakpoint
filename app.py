from flask import Flask, render_template, redirect, url_for, g, request, session, jsonify
from flask.ext.mongoengine import MongoEngine
from flask.ext.security import Security, MongoEngineUserDatastore, \
        UserMixin, RoleMixin, login_required
from flask_oauth import OAuth
from urllib2 import urlopen
                    
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

# Create a fake user to start with.
#@app.before_first_request
#def create_user():
#    user_datastore.create_user(email='darylsew@gmail.com', password='password')

# Views
@app.route('/')
def home():
    return render_template('map.html')

@app.route('/recorder')
def audio():
    return render_template('recorder.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/upload')
def upload():
    #params = request.getParams()
    #lat = param['lat']
    #lon = param['lon']
    #amp = param['amp']
    #freq = param['freq']
    #database.add(lat, lon, amp, freq)
    return render_template('map.html', success=True)


@app.route('/test')
@login_required
def test():
    return render_template('test.html', worked='it worked!')

@app.route('/test2')
def test2():
    return render_template('test2.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user_datastore.create_user(email=email, password=password)
        return redirect(url_for('home'))
    return render_template('register.html')

# dropdown demo
@app.route('/dropdown')
def dropdown():
    return render_template('logout.html')

@app.route('/userlogin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('map'))
    elif request.method == 'GET':
        f = open('errorLog', 'wb')
        print >> f, request.args.get('user')
        session['username'] = request.args.get('user')
        # when does it fail? idk
        return jsonify(success=True)
        #we don't need a redirect, I think
        #return redirect(url_for('map'))
    # if it's a GET request, it should include the email in it.
    # not confident we want to do it that way but i guess it works
    return render_template(url_for('map'))

@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(port=9999)
