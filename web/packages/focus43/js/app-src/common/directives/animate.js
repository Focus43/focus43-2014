angular.module('f43.common')

    .directive('animate', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var elTrack         = document.querySelector('#track'),
                parallaxLayers  = document.querySelectorAll('#parallax .layer'),
                sections        = document.querySelectorAll('section'),
                timelineMaster  = new TimelineLite({paused:true}),
                winH, winW, trackH, trackW;

            function processDimensions(){
                winH = document.documentElement.clientHeight;
                winW = document.body.clientWidth;
                trackH = elTrack.clientHeight;
                trackW = winW;
            }

            function random(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }


            /**
             * @returns TimelineLite
             */
            function timelineSection1(){
                var _timeline = (new TimelineLite()).
                    to(elTrack, 0, {top:0, ease: Power2.easeIn}, 0).
                    staggerTo(sections[0].querySelectorAll('h1 span'), 0.15, {scale:random(2,3), opacity:0}, 0.05);

                return _timeline;
            }

            /**
             * @returns TimelineLite
             */
            function timelineSection2(){
                TweenLite.set(sections[1].querySelector('.inside-track'), {
                    transformOrigin:'50% 100%'
                });

                var _timeline = (new TimelineLite({
                    onComplete: function(){
                        console.log('section2 timeline done', this);
                        //this.addPause();
                    }
                })).
                    to(elTrack, 1, {top:-(winH), ease:Power2.easeIn}, 0).
                    fromTo(sections[1].querySelector('.pane'), 1, {top:'100%'}, {top:0}).
                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:1, backgroundColor:'rgba(255,255,255,0.5)'}).
                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%', delay:1}).
                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:0}).
                    to(sections[1].querySelector('.node:nth-child(2)'), 0.5, {opacity:1, backgroundColor:'rgba(15,15,79,0.8)'}, '-=0.5').
                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%'}).
                    to(sections[1], 1, {rotationX:20, rotationY:20, scale:0.7}).
                    to(sections[1].querySelector('.subscroller'), 1, {z: 10}).
                    to(sections[1].querySelector('.inside-track'), 1, {z: 50, rotationX: 90});


                return _timeline;
            }

            function timelineSection3(){
                var _timeline = (new TimelineLite()).
                    to(elTrack, 1, {top:-(winH*2), ease:Power2.easeIn}, 0).
                    fromTo(sections[2].querySelector('.rotated'), 2, {left:'-100%'}, {left:0, ease:Power2.easeInOut});

                return _timeline;
            }

            function timelineSection4(){
                var _timeline = (new TimelineLite())
                    .to(elTrack, 1, {top:-(winH*3), ease:Power2.easeIn}, 0);
                return _timeline;
            }

            function timelineSection5(){
                var _timeline = (new TimelineLite())
                    .to(elTrack, 1, {top:-(winH*4), ease:Power2.easeIn}, 0);
                return _timeline;
            }

            function timelineCanvas(){
                var canvas  = document.createElement('canvas'),
                    context = canvas.getContext('2d');

                canvas.width = winW;
                canvas.height = winH;
                document.body.appendChild(canvas);

                var canvasWidth = canvas.width,
                    canvasHeight = canvas.height;

                // Create an array to store our particles
                var particles = [];

                // The amount of particles to render
                var particleCount = 30;

                // The maximum velocity in each direction
                var maxVelocity = 2;

                // Create an image object (only need one instance)
                var imageObj = new Image();

                // Once the image has been downloaded then set the image on all of the particles
                imageObj.onload = function() {
                    particles.forEach(function(particle) {
                        particle.setImage(imageObj);
                    });
                };

                // Once the callback is arranged then set the source of the image
                imageObj.src = "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png";

                // A function to create a particle object.
                function Particle(context) {

                    // Set the initial x and y positions
                    this.x = 0;
                    this.y = 0;

                    // Set the initial velocity
                    this.xVelocity = 0;
                    this.yVelocity = 0;

                    // Set the radius
                    this.radius = 5;

                    // Store the context which will be used to draw the particle
                    this.context = context;

                    // The function to draw the particle on the canvas.
                    this.draw = function() {

                        // If an image is set draw it
                        if(this.image){
                            this.context.drawImage(this.image, this.x-128, this.y-128);
                            // If the image is being rendered do not draw the circle so break out of the draw function
                            return;
                        }
                        // Draw the circle as before, with the addition of using the position and the radius from this object.
                        this.context.beginPath();
                        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                        this.context.fillStyle = "rgba(0, 255, 255, 1)";
                        this.context.fill();
                        this.context.closePath();
                    };

                    // Update the particle.
                    this.update = function() {
                        // Update the position of the particle with the addition of the velocity.
                        this.x += this.xVelocity;
                        this.y += this.yVelocity;

                        // Check if has crossed the right edge
                        if (this.x >= canvasWidth) {
                            this.xVelocity = -this.xVelocity;
                            this.x = canvasWidth;
                        }
                        // Check if has crossed the left edge
                        else if (this.x <= 0) {
                            this.xVelocity = -this.xVelocity;
                            this.x = 0;
                        }

                        // Check if has crossed the bottom edge
                        if (this.y >= canvasHeight) {
                            this.yVelocity = -this.yVelocity;
                            this.y = canvasHeight;
                        }

                        // Check if has crossed the top edge
                        else if (this.y <= 0) {
                            this.yVelocity = -this.yVelocity;
                            this.y = 0;
                        }
                    };

                    // A function to set the position of the particle.
                    this.setPosition = function(x, y) {
                        this.x = x;
                        this.y = y;
                    };

                    // Function to set the velocity.
                    this.setVelocity = function(x, y) {
                        this.xVelocity = x;
                        this.yVelocity = y;
                    };

                    this.setImage = function(image){
                        this.image = image;
                    };
                }

                // A function to generate a random number between 2 values
                function generateRandom(min, max){
                    return Math.random() * (max - min) + min;
                }

                // Create the particles and set their initial positions and velocities
                for(var i=0; i < particleCount; ++i){
                    var particle = new Particle(context);

                    // Set the position to be inside the canvas bounds
                    particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));

                    // Set the initial velocity to be either random and either negative or positive
                    particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
                    particles.push(particle);
                }

                function update() {
                    particles.forEach(function(particle) {
                        particle.update();
                    });
                }

                function draw() {
                    // Clear the drawing surface and fill it with a black background
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // Go through all of the particles and draw them.
                    particles.forEach(function(particle) {
                        particle.draw();
                    });
                }

                var _tl = (new TimelineLite());

                TweenLite.ticker.addEventListener('tick', function(){
                    update();
                    draw();
                });

                return _tl;
            }

            function buildTimelines(){
                // Nest the timelines into the master
                timelineMaster
                    //.add(timelineCanvas(), 'canvas');
                    .add(timelineSection1(), 'section1')
                    .add(timelineSection2(), 'section2')
                    .add(timelineSection3(), 'section3')
                    .add(timelineSection4(), 'section4')
                    .add(timelineSection5(), 'section5');

                $window['tlMaster'] = timelineMaster;
            }

            function _linkFn( scope, $element, attrs, Controller ){
                processDimensions();
                buildTimelines();


                angular.element($window)
                    // "onWindowScroll"
                    .on('scroll', function(){
                        // Set the background parallax position independently
                        Controller.progressTo(this.pageYOffset);
                    })
                    // "onWindowResize"
                    .on('resize', processDimensions);
            }

            return {
                restrict: 'A',
                scope:    false,
                link:     _linkFn,
                controller: ['$rootScope', '$q', function( $rootScope, $q ){

                    var self = this;

                    /**
                     * Call this method to set the progress to a certain point; modifies
                     * the parallax backgrounds then the timelineMaster independently.
                     * @param int verticalOffset
                     */
                    self.progressTo = function( verticalOffset ){
                        var _scroll = (verticalOffset / (trackH - winH)),
                            _moveX  = _scroll * winW;
                        //TweenLite.set(parallaxLayers, {x:-_moveX});
                        timelineMaster.progress(_scroll);
                    };

                }]
            };
        }
    ]);