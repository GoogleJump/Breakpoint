from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    #params = request.getParams()
    #lat = param['lat']
    #lon = param['lon']
    #amp = param['amp']
    #freq = param['freq']
    #database.add(lat, lon, amp, freq)
    return render_template("index.html")

@app.route("/recorder")
def audio():
    return render_template("recorder.html")

@app.route("/map")
def map():
    return render_template("map.html")

if __name__ == '__main__':
    app.run(port=9999)
