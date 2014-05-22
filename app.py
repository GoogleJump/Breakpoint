from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    #params = request.getParams()
    #lat = param['lat']
    #lon = param['lon']
    #amp = param['amp']
    #freq = param['freq']
    #database.add(lat, lon, amp, freq)
    return render_template("index.html")

if __name__ == '__main__':
    app.run()
