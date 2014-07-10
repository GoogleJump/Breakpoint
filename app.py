from functools import wraps
from flask import Flask, render_template, redirect, url_for, g, request
                    
app = Flask(__name__)

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
    return render_template("index.html")

@app.route("/recorder")
def audio():
    return render_template("recorder.html")

@app.route("/map")
def map():
    return render_template("map.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # login and validate the user...
        login_user(user)
        flash("Logged in successfully.")
        # TODO where to redirect to?
        return redirect(url_for("index"))
    return render_template("login.html", form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


if __name__ == '__main__':
    app.run(port=9999)
