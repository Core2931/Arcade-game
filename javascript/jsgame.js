/***********Resources.js***********
**********************************/
/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();






/***********app.js****************
**********************************/
//game's initial level
var level = 1;
// Enemies our player must avoid
var Enemy = function(locX,locY) {
    this.sprite = 'https://raw.githubusercontent.com/jamesmhee/Arcade-game/master/image/bug.png';
    this.x = locX;
    this.y = locY;
    this.argument1 = locX;
    this.argument2 = locY;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    //sets the speed of the Enemy based on the level
    if( level === 1){
        for(var i=0; i<allEnemies.length; i++){
            allEnemies[i].speed=80;
        }
    }
    if( level === 2 ){
        for(var j=0; j<allEnemies.length; j++){
            allEnemies[j].speed=10;
        }
    }
    if( level === 3 ){
        for(var k=0; k<allEnemies.length; k++){
            allEnemies[k].speed=10;
        }
    }
    // multiplying any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x+(this.speed*dt);

    //reset enemy's position
    if( this.x >= 500 ){
        this.reset();
    }
    //handling collision with the enemies
    if( player.x >= this.x -40 && player.x <=this.x + 40 ){
        if( player.y >= this.y -40 && player.y <=  this.y+40 ){
            player.x = 200;
            player.y = 400;
        }
    }
};
Enemy.prototype.reset = function(){
    this.x = this.argument1;
    this.y = this.argument2;
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function(x,y){
    this.sprite =  'https://raw.githubusercontent.com/jamesmhee/Arcade-game/master/image/mark.png';
    this.x = x;
    this.y = y;
};
Player.prototype.update = function(dt){
    //changes, handles and displays the level
    if( this.y < -18 ){
        this.reset(); 
        level++;      
        if(level > 3){          
           alert("YOU WIN")
            setTimeout(showResult,1000);
            level = 1;
        }
        document.getElementById("myspan").innerHTML= level;
    }
        
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(rcv){
    if( rcv === 'left' && this.x > 0 )  
        this.x = this.x - 20;
    else if( rcv === 'right' && this.x < 400)
        this.x = this.x + 20;
    else if( rcv === 'up' && this.y > -50)
        this.y = this.y - 20;
    else if( rcv === 'down' && this.y < 400)
        this.y = this.y + 20;
};
Player.prototype.reset = function(){
    this.x = 200;
    this.y = 400;
};

var showResult = function(){
     $('h3').css("display","none").text("");
};

// Now instantiate your objects.
var enemy1 = new Enemy(-100,60);
var enemy2 = new Enemy(-600,60);
var enemy3 = new Enemy(-165,140);
var enemy4 = new Enemy(-500,140);
var enemy5 = new Enemy(-200,220);
var enemy6 = new Enemy(-400,220);
var enemy7 = new Enemy(-300,60);
var enemy8 = new Enemy(-300,140);
var player1 = new Player(200,400);


var allEnemies = [enemy1,enemy2,enemy3,enemy4,enemy5,enemy6,enemy7,enemy8];
var player = player1;


//for playing with a touch device like smartphone
$(function(){
  $("canvas").bind( "swipeleft", function(){
        player.handleInput('left');
  });

  $("canvas").bind( "swiperight", function(){
        player.handleInput('right');
  });

  $("canvas").bind( "swipeup", function(){
        player.handleInput('up');
  });

  $("canvas").bind( "swipedown", function(){
        player.handleInput('down');
  });
});

//for playing with keyboard
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


//swipedown and swipe up code
(function() {
    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();





/***********Engine.js**************
**********************************/
/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();

    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/water-block.png',   // Top row is water
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',   // Row 1 of 3 of stone
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',   // Row 2 of 3 of stone
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',   // Row 3 of 3 of stone
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png',   // Row 1 of 2 of grass
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',
        'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/water-block.png',
        'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png',
        'https://raw.githubusercontent.com/jamesmhee/Arcade-game/master/image/bug.png',
        'https://raw.githubusercontent.com/jamesmhee/Arcade-game/master/image/mark.png',
        'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);



