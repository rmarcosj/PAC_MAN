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


	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		if (this.map[row]==null) {
			this.map[row]=[];
		}
		this.map[row][col]=newValue;
	};

	this.getMapTile = function(row, col){
		// tu código aquí	
		if (this.map[row]==null) {
			return null;
		}
		return this.map[row][col];
	};

	this.printMap = function(){
		// tu código aquí
	};

	this.loadLevel = function(){
		// leer res/levels/1.txt y guardarlo en el atributo map	
		// haciendo uso de setMapTile
			var data=$.ajax({url:'res/levels/1.txt',async:false}).responseText;
			var list=data.split('\n');
			var i=0;
			while(list[i][0]!='#'){
				i++;
			}
			var line=list[i].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			else{
				console.log("Error en la carga del fichero");
			}
			i++;
			while(list[i][0]!='#'){
				i++;
			}
			var line=list[i].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			else{
				console.log("Error en la carga del fichero");
			}
			i++;
			while(list[i][0]!='#'){
				i++;
			}
			i++;
			var j=0;
			var r=0;
			while(list[i][0]!='#'){
				var line=list[i].split(' ');
				r=0;
				while(line[r]){
					this.setMapTile(j,r,line[r]);
					r++;
				}
				j++;
				i++;
			}
	};

    this.drawMap = function(){

	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

    		var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3
			};
			var i=0;
			var j;
			while(this.getMapTile(i,0)){
				j=0;
				while(this.getMapTile(i,j)){
					var val=this.getMapTile(i,j);
					ctx.beginPath();
					ctx.moveTo(j*TILE_WIDTH,i*TILE_HEIGHT)
					if(val>=100 && val<200){
						ctx.fillStyle='blue';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==3){
						//powerball
						ctx.fillStyle='red';
						ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
						ctx.fill();
					}
					else if(val==2){
						//normalball
						ctx.fillStyle='white';
						ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
						ctx.fill();
					}
					else if(val==20){
						//door-h
						
					}
					else if(val==21){
						//door-v
						
					}
					else if(val==10){
						//phantom
						ctx.fillStyle='black';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==11){
						//phantom
						ctx.fillStyle='black';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==12){
						//phantom
						ctx.fillStyle='black';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==13){
						//phantom
						ctx.fillStyle='black';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==4){
						//pacman
					
					}
					j++;
					ctx.closePath();
				}
				i++;
			}
		 
	};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	
	Pacman.prototype.move = function() {

		// tu código aquí
		var newx=this.x+this.velX;
	    var newy=this.y+this.velY;
	    if(newx<=w-this.radius*2&&newx>=0){
	      this.x=newx;
	    }
	    if(newy<=h-this.radius*2&&newy>=0){
	      this.y=newy;
	    }
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
    // Pac Man	    
	// tu código aquí
		ctx.fillStyle='yellow';
        ctx.beginPath();
        ctx.moveTo(this.x+this.radius,this.y+this.radius);
        ctx.arc(this.x+this.radius,this.y+this.radius,this.radius,Math.PI*this.angle2,(Math.PI*this.angle1),true);
        ctx.closePath();
        ctx.fill();
    };

	var player = new Pacman();

	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



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
		// tu código aquí
		if(inputStates["left"]==true){
	      player.velX=-player.speed;
	      player.velY=0;
	    }
	    if(inputStates["right"]==true){
	      player.velX=player.speed;
	      player.velY=0;
	    }
	    if(inputStates["up"]==true){
	      player.velX=0;
	      player.velY=-player.speed;
	    }
	    if(inputStates["down"]==true){
	      player.velX=0;
	      player.velY=player.speed;
	    }
	    if(inputStates["space"]==true){
	      console.log("pause");
    	}
	
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
        // Clear the canvas
    clearCanvas();
   
	thisLevel.drawMap();

	player.move();
 
	player.draw();
        // call the animation loop every 1/60th of second
    requestAnimationFrame(mainLoop);
    };

   var addListeners = function(){
		//add the listener to the main, window object, and update the states
		// Tu código aquí
	window.addEventListener("keydown",function(e){
		  inputStates.left=false;
		  inputStates.right=false;
		  inputStates.up=false;
		  inputStates.down=false;
		  inputStates.space=false;
		  if (e.keyCode==37) {
			inputStates.left=true;
		  }
		  if (e.keyCode==38) {
			inputStates.up=true;
		  }
		  if (e.keyCode==39) {
			inputStates.right=true;
		  }
		  if (e.keyCode==40) {
			inputStates.down=true;
		  }
		  if (e.keyCode==32) {
			inputStates.space=true;
		  }
    });
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

test('Mapa correctamente dibujado en pantalla', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {


	     	   assert.pixelEqual( canvas,  35,35, 0, 0, 255, 255,"esquina superior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 250,35, 0, 0, 0, 0,"puerta superior negra");
	     	   assert.pixelEqual( canvas, 465,35, 0, 0, 255, 255,"esquina superior derecha azul");
	     	   assert.pixelEqual( canvas, 58,58, 255, 255, 255,255,"primera pildora esquina superior izquierda blanca");
	     	   assert.pixelEqual( canvas, 58,82, 255, 0,0,255,"pildora de poder esquina superior izquierda roja");
	     	   assert.pixelEqual( canvas, 442,82, 255, 0,0,255,"pildora de poder esquina superior derecha roja");

	     	   assert.pixelEqual( canvas, 35,300, 0, 0,0,0 ,"puerta lateral izquierda negra");
	     	   assert.pixelEqual( canvas, 252,300, 0, 0,0, 255,"centro de casa de los phantoms negros");
	     	   assert.pixelEqual( canvas, 482, 300, 0, 0,0, 0,"puerta lateral derecha negra");
		
		   assert.pixelEqual( canvas, 12, 585, 0, 0,255,255,"esquina inferior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 60, 538, 0, 0,255,255,"cuadrado interior esquina inferior izquierda azul");
	     	   assert.pixelEqual( canvas, 250,538, 255, 255,255,255,"pildora central lateral inferior blanca");
	     	   assert.pixelEqual( canvas, 442,538, 0, 0,255,255,"cuadrado interior esquina inferior derecha azul");
		   assert.pixelEqual( canvas, 488,582, 0, 0,255,255,"esquina inferior derecha azul"); 

    		   done();
  }, 1000);

});

