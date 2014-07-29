Breakpoint
==========

Heatmaps for sound. At some point we should probably look into setting up a virtual environment for flask development and maintaining a setup.py script, but this will do for now.

##Setup
    sudo apt-get install python-pip
    sudo pip install flask flask-oauth flask-security flask-mongoengine

##Usage
    python app.py

Once we're running production databases/etc the credentials will not be hardcoded and versioned... but for now the worst that can happen is someone maxes out a free mongohq instance/free tier for google APIs so it's logistically easier to keep it this way.

Storyboarding
-------------
open app/webpage  
modal dialog comes up: "login with facebook/github/etc" if you would like to upload a sound bite (so we can attach bites to users if they choose to not be anonymous)  
on exit/login, the map with soundheatmapoverlay is visible  
