//var overlay;
//canvasOverlay.prototype = new google.maps.OverlayView();
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var map;
var canvasLayer;
var context;
var rectLatLng = new google.maps.LatLng(40, -95);
var rectWidth = 6.5;
var songs = [];
var cachedBox = [[0, 0], [0, 0]]; 

function animate(count) {
    songs.forEach(function(song) {
        if (song['duration'] > 0) {
            draw(
                song['location']['coordinates'][1],
                song['location']['coordinates'][0], 
                0.1, 
                0.9, 
                song['centroids'][count]/50, 
                song['volumes'][count]);
            song['duration'] -= 1.0 / 60.0;
        }
    });

    var requestId = requestAnimFrame( function() {
        count++;
        animate(count);
    });
}

// TODO singular centroid, volume
function draw(x, y, radius, opacity, centroids,volumes) {
    var mapProjection = map.getProjection();
    var loc = new google.maps.LatLng(x, y);
    var worldPoint = mapProjection.fromLatLngToPoint(loc);
    var gradient1 = context.createRadialGradient(worldPoint.x,worldPoint.y, radius/3, worldPoint.x, worldPoint.y, radius);
    var c;
    // FIXME refactor; too much repeated code
    //Centroids conditionals
    if (centroids <=20) {
        c = randomColor({hue: 'purple', count: 18})[0];
        gradient1.addColorStop(0, "purple");
        gradient1.addColorStop(1, c); 
    }
    if (centroids >20 && centroids <=40) {
        c = randomColor({hue: 'purple', count: 18})[0];
        gradient1.addColorStop(0, "blue");
        gradient1.addColorStop(1, c); 
    } 
    if (centroids >40 && centroids <=60) {
        c = randomColor({hue: 'blue', count: 18})[0];
        gradient1.addColorStop(0, "green");
        gradient1.addColorStop(1, c); 
    } 
    if (centroids >60 && centroids <=80) {
        c = randomColor({hue: 'green', count: 18})[0];
        gradient1.addColorStop(0, "yellow");
        gradient1.addColorStop(1, c); 
    }
    if (centroids>80 && centroids <=100) {
        c = randomColor({hue: 'yellow', count: 18})[0];
        gradient1.addColorStop(0, "orange");
        gradient1.addColorStop(1, c); 
    }
    if (centroids>100) {
        c = randomColor({hue: 'orange', count: 18})[0];
        gradient1.addColorStop(0, "red");
        gradient1.addColorStop(1, c); 
    }


    //Volume Conditionals.
    // if(volumes <= 20) {
    //     radius = 10;
    // }
    // if(volumes > 20 && volumes <=40) {
    //     radius = 20;
    // } 
    // if(volumes > 40 && volumes <=60) {
    //     radius = 30;
    // } 
    // if (volumes > 60 && volumes <=80) {
    //     radius = 40;
    // } 
    // if (volumes > 80 && volumes <=100) {
    //     radius = 50;
    // } 
    // if(volumes > 100) {
    //     radius = 60;
    // }


        // gradient1.addColorStop(0, "orange");
        // gradient1.addColorStop(1, "blue"); 

    context.fillStyle = gradient1;
    context.globalAlpha=opacity; //this is the opacity
    context.beginPath();
    //var worldPoint = mapProjection.fromLatLngToPoint(rectLatLng)
    
    context.arc(worldPoint.x, worldPoint.y, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

function updateCache() {
    var bounds = map.getBounds();
    CACHE_SCOPE = (5 / map.zoom);
    cachedBox[0][0] = bounds.xa.k - CACHE_SCOPE;
    cachedBox[0][1] = bounds.xa.j + CACHE_SCOPE;
    cachedBox[1][0] = bounds.pa.k + CACHE_SCOPE;
    cachedBox[1][1] = bounds.pa.j - CACHE_SCOPE; 
    var corners = [[cachedBox[1][1], cachedBox[0][0]], [cachedBox[1][0], cachedBox[0][1]]];
    var requestData = {
        box: corners,
        zoom: map.zoom
    };
    $.ajax({
            type: "POST",
            url: "/query",
            data: JSON.stringify(requestData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log("server response to db query:");
                console.log(data);
                songs = songs.concat(data);
            },
            failure: function(err){
                console.log("failed to ajax");
                console.log(err);
            }
    });
}

function needsUpdate() {
    var bounds = map.getBounds();
    //console.log("xaK bd: " + cachedBox[0][0] >= bounds.xa.k);
    // splitting these up instead of doing it all in one line since
    // somehow this avoids returning undefined...
    var corner1 = cachedBox[0][0] >= bounds.xa.k;
    var corner2 = cachedBox[0][1] <= bounds.xa.j;
    var corner3 = cachedBox[1][0] <= bounds.pa.k;
    var corner4 = cachedBox[1][1] >= bounds.pa.j;
    //console.log("corner1 " + bounds.xa.k);
    //console.log("corner2 " + bounds.xa.j);
    //console.log("corner3 " + bounds.pa.k);
    //console.log("corner4 " + bounds.pa.j);
    var bool = corner1 || corner2 || corner3 || corner4;
    //console.log("bool: " + bool);
    return bool;
}

function initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(37.389444, -122.081944),
        zoom: 8,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: false,
    };

    map = new google.maps.Map(
        document.getElementById("map-canvas"), 
        mapOptions);

    function resizeMap() {
        $('#map-canvas').height($(window).height());
        $('#map-canvas').width($(window).width());
    }

    resizeMap();


    $(window).resize(resizeMap);
    // initialize the canvasLayer
    var canvasLayerOptions = {
        map: map,
        resizeHandler: resize,
        animate: false,
        updateHandler: update
    };
    canvasLayer = new CanvasLayer(canvasLayerOptions);
    context = canvasLayer.canvas.getContext('2d');

    google.maps.event.addListenerOnce(map, 'idle', function() {
        // do something only the first time the map is loaded
        animate(0);
    });
} 




function resize() {
    // nothing to do here
}

function update() {


    // clear previous canvas contents
    var canvasWidth = canvasLayer.canvas.width;
    var canvasHeight = canvasLayer.canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // we like our rectangles green
    //context.fillStyle = 'rgba(0, 255, 0, 1)';

    /* We need to scale and translate the map for current view.
     * see https://developers.google.com/maps/documentation/javascript/maptypes#MapCoordinates
     */
    var mapProjection = map.getProjection();

    /**
     * Clear transformation from last update by setting to identity matrix.
     * Could use context.resetTransform(), but most browsers don't support
     * it yet.
     */
    context.setTransform(1, 0, 0, 1, 0, 0);

    // scale is just 2^zoom
    var scale = Math.pow(2, map.zoom);
    context.scale(scale, scale);

    /* If the map was not translated, the topLeft corner would be 0,0 in
     * world coordinates. Our translation is just the vector from the
     * world coordinate of the topLeft corder to 0,0.
     */
    var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
    context.translate(-offset.x, -offset.y);

    // project rectLatLng to world coordinates and draw
    //var worldPoint = mapProjection.fromLatLngToPoint(rectLatLng);
    //context.fillRect(worldPoint.x, worldPoint.y, rectWidth, rectWidth);
    
    //console.log(needsUpdate());
    if (needsUpdate()) {
        updateCache();
    }
}

google.maps.event.addDomListener(window, 'load', initialize);

