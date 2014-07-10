from functools import wraps
from flask import Flask, render_template, redirect, url_for, g, request, session
from flask.ext.login import *
from flask_oauth import OAuth
                    
app = Flask(__name__)
oauth = OAuth()
app.secret_key = 'secret_key'
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

"""
Supporting stuff.
"""
def login_required(f):
    """
    Decorator for pages that will require users to be logged in.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

#def load_user(userid):
#    return User.get(userid)

"""
Webpage routing stuff.
"""
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

@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO figure out everything
    if request.method == 'POST':
        session['username'] = request.form['username']
        flash('logged in!')
        return redirect(url_for('index'))
    return """
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    """

@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    login_manager = LoginManager()
    login_manager.init_app(app)

    # FIXME: Disable debug mode in prodoction!
    app.debug = True
    app.run(port=9999)
