//var overlay;
//canvasOverlay.prototype = new google.maps.OverlayView();

var map;
var canvasLayer;
var context;
var rectLatLng = new google.maps.LatLng(40, -95);
var rectWidth = 6.5;


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

        var swBound = new google.maps.LatLng(-34.397, 150.644);
        var neBound = new google.maps.LatLng(-34.3, 150.9);
        var bounds = new google.maps.LatLngBounds(swBound, neBound);

        //overlay = new canvasOverlay(bounds, map);

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
