// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};

	var Pacman = function() {
		this.radius = 15;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	
	Pacman.prototype.move = function() {

		// Tu código aquí		
		if(this.velX >0 && this.x<w-30){
			this.x = this.x+this.velX;		
			}
			else if(this.x>=w-30)
			{
			this.x = w-30;
			}
			
		if(this.velX <0 && this.x>0){
			this.x = this.x+this.velX;
			}
			else if(this.x<=0)
			{
			this.x = 0;		
			}
			
		if(this.velY >0 && this.y<h-30){
			this.y = this.y+this.velY;		
			}
			else if(this.y>=h-30)
			{
			this.y = h-30;
			}
			
		if(this.velY <0 && this.y>0){
			this.y = this.y+this.velY;
			}
			else if(this.y<=0)
			{
			this.y= 0;		
			}	
	};
	


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
        // Pac Man
	    // Tu código aquí	
  	    ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 0, 255)";
		ctx.strokeStyle="black";
		ctx.arc(this.x+this.radius, this.y+this.radius, this.radius, 0, this.angle1*Math.PI, this.angle2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();   
    }
  
	// OJO, esto hace a pacman una variable global	
	player = new Pacman();



    var measureFPS = function(newTime){
	// la primera ejecución tiene una condición especial
   
         if(lastTime === undefined) {
           lastTime = newTime; 
           return;
         }
      
	// calcular el delta entre el frame actual y el anterior
    var diffTime = newTime - lastTime; 

        if (diffTime >= 1000) {

            fps = frameCount;    
            frameCount = 0;
            lastTime = newTime;
        }

	// mostrar los FPS en una capa del documento
	// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
    };
  
    // clears the canvas content
    var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
    };

	var checkInputs = function(){
		// Tu código aquí
		if(inputStates.left){
    	player.velX = -player.speed;
    	//player.move();
		}
		else if (inputStates.right){
			player.velX = player.speed;
			//player.move();
		}
    
    	if(inputStates.up){
    	player.velY = -player.speed;
    	//player.move();
		}
		else if (inputStates.down){
			player.velY = player.speed;
			//player.move();
		}
    
		if(inputStates.space){
			console.log("has pulsado espacio");
		}
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
		checkInputs();
 
        // Clear the canvas
		clearCanvas();
    
		player.move();
 
		player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };
	
	function mover(e) {
		if(e.keyCode==37)
			{
			inputStates.left = true;
			}
			else if(e.keyCode==39){
			inputStates.right = true;
			}
			
			if(e.keyCode==38)
			{
			inputStates.up = true;
			}
			else if(e.keyCode==40){
			inputStates.down = true;
			}
			
			else if (e.keyCode==32){
			inputStates.space = true;
			}
			}
			function parar (e) {
			  if(e.keyCode==37)
			{
			inputStates.left = false;
			}
			else if(e.keyCode==39){
			inputStates.right = false;
			}
			
			 if(e.keyCode==38)
			{
			inputStates.up = false;
			}
			else if(e.keyCode==40){
			inputStates.down = false;
			}    
			
			else if (e.keyCode==32){
			inputStates.space = false;
			}
    }
	
    var addListeners = function(){
		//add the listener to the main, window object, and update the states
		// Tu código aquí
		window.addEventListener("keydown", mover, false);
		window.addEventListener("keyup", parar, false);
    };


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
		addListeners();

		player.x = 0;
		player.y = 0; 
		player.velY = 0;
		player.velX = player.speed;
 
        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};

var game = new GF();
game.start();

 test('Testeando pos. inicial', function(assert) {  

	     	assert.pixelEqual( canvas, player.x+10, player.y+10, 255, 255,0,255,"Passed!"); 
});

	
test('Movimiento hacia derecha OK', function(assert) {

  	var done = assert.async();
	inputStates.right = true;
  	setTimeout(function() {
			// console.log(player.x);
			assert.ok(player.x > 110 && player.x < w, "Passed!");

			inputStates.right = false;
			inputStates.down = true;
    		done();
			test2();
  }, 1000);

});


var test2 = function(){
	test('Movimiento hacia abajo OK', function(assert) {

		var done = assert.async();
		setTimeout(function() {
				// console.log(player.y);
				assert.ok(player.y > 110 && player.y < h, "Passed!");
				inputStates.down = false;
				inputStates.left = true;
				done();
				test3();
	  }, 1000);

	});
};

var test3 = function(){
	test('Movimiento hacia izquierda OK', function(assert) {

		var done = assert.async();
		setTimeout(function() {
				// console.log(player.x);
				assert.ok(player.x == 0 , "Passed!");
				inputStates.left = false;
				inputStates.up = true;
				done();
				test4();
	  }, 1000);

	}); 
};

var test4 = function(){
	test('Movimiento hacia arriba OK', function(assert) {

		var done = assert.async();
		setTimeout(function() {
				// console.log(player.y);
				assert.ok(player.y < 10 , "Passed!");
				inputStates.up = false;
				done();
	  }, 1000);

	}); 
};


