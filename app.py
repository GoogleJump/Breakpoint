from functools import wraps
from flask import Flask, render_template, redirect, url_for, g, request, session
                    
app = Flask(__name__)
app.secret_key = 'secret_key'

"""
Supporting stuff.
"""
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def load_user(userid):
    return User.get(userid)

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
    login_manager = LoginManager()
    login_manager.init_app(app)
    return render_template('index.html')

@app.route('/recorder')
def audio():
    return render_template('recorder.html')

@app.route('/map')
def map():
    return render_template('map.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
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

    form = LoginForm()
    if form.validate_on_submit():
        # login and validate the user...
        login_user(user)
        flash('Logged in successfully.')
        # TODO where to redirect to?
        return redirect(url_for('index'))
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.port = 9999
    # FIXME: Disable debug mode in prodoction!
    app.debug = True
    app.run()
