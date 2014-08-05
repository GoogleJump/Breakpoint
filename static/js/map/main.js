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
            success: function(data){
                console.log("server response to db query:");
                console.log(data);
                songs = arrayUnique(songs.concat(data));
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

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

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
    animate();
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
    context.fillStyle = 'rgba(0, 255, 0, 1)';

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
    var worldPoint = mapProjection.fromLatLngToPoint(rectLatLng);
    context.fillRect(worldPoint.x, worldPoint.y, rectWidth, rectWidth);
    
    //console.log(needsUpdate());
    if (needsUpdate()) {
        updateCache();
    }
}


    ///** @constructor */
    //function canvasOverlay(bounds, map) {
    //
    //    // Initialize all properties.
    //    this.bounds_ = bounds;
    //    this.map_ = map;
    //
    //    // Define a property to hold this canvas's div + the canvas.
    //    // We'll actually create this div upon receipt of
    //    // the onAdd() method so we'll leave it null for now.
    //    this.canvas_ = null;
    //    this.div_ = null;
    //
    //    // Explicitly call setMap on this overlay.
    //    this.setMap(map);
    //}
    //
    ///**
    // * onAdd is called when the map's panes are ready and the overlay
    // * has been added to the map.
    // */
    //canvasOverlay.prototype.onAdd = function() {
    //    var div = document.createElement('div');
    //    div.style.borderstyle = 'none';
    //    div.style.borderWidth = '0px';
    //    div.style.position = 'absolute';
    //
    //    // Create the canvas element and attach it to the div.
    //    var canvas = document.createElement('canvas');
    //    canvas.id = 'heat';
    //    canvas.style.width = '100%';
    //    canvas.style.height = '100%';
    //
    //    var ctx = canvas.getContext('2d');
    //    ctx.beginPath();
    //    ctx.arc(20, 20, 50, 0, 2 * Math.PI, false);
    //    ctx.fillStyle = 'green';
    //    ctx.fill();
    //    ctx.lineWidth = 5;
    //    ctx.strokeStyle = '#003300';
    //    ctx.stroke();
    //
    //    this.canvas_ = canvas;
    //    div.appendChild(canvas);
    //    this.div_ = div;
    //
    //    // Add the element to the "overlayLayer" pane.
    //    var panes = this.getPanes();
    //    panes.overlayLayer.appendChild(div);
    //};
    //
    //canvasOverlay.prototype.draw = function() {
    //
    //    // We use the south-west and north-east coordinates
    //    // to peg it to the correct position and size. To do this,
    //    // we need to retrieve the projection from the overlay.
    //    var overlayProjection = this.getProjection();
    //
    //    // Retrieve the south-west and north-east coords of this overlay
    //    // in LatLngs and convert them to pixel coordinates.
    //    // We'll use these coordinates to resize the div.
    //    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    //    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    //
    //    // Resize the canvas div to fit the indicated dimensions.
    //    var div = this.div_;
    //    div.style.left = sw.x + 'px';
    //    div.style.top = ne.y + 'px';
    //    div.style.width = (ne.x - sw.x) + 'px';
    //    div.style.height = (sw.y - ne.y) + 'px';
    //    $('#heat').width = $('#map-canvas').width();
    //    $('#heat').height = $('#map-canvas').height();
    //};
    //
    //// The onRemove() method will be called automatically from the API if 
    //// we ever set the overlay's map property to 'null'.
    //canvasOverlay.prototype.onRemove = function() {
    //    this.div_.parentNode.removeChild(this.div_);
    //    this.div_ = null;
    //};

    google.maps.event.addDomListener(window, 'load', initialize);
