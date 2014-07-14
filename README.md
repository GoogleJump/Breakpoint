Breakpoint
==========

Heatmaps for sound. Server stuff still heavily in progress, so those working on JS stuff, stick to opening the html files with your browser rather than navigating there through the server.

At some point we should probably look into setting up a virtual environment for flask development and maintaining a setup.py script, but this will do for now.

##Setup
    sudo apt-get install python-pip
    sudo pip install flask flask-oauth flask-security flask-mongoengine

##Usage
    python app.py

Storyboarding
-------------
open app/webpage  
modal dialog comes up: "login with facebook/github/etc" if you would like to upload a sound bite (so we can attach bites to users if they choose to not be anonymous)  
on exit/login, the map with soundheatmapoverlay is visible  
