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
			// tu código aquí
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
					if (this.getMapTile(j,r)==2 || this.getMapTile(j,r)==3) {
						this.pellets++;
					}
					if (this.getMapTile(j,r)==4){
						player.homeX=r*thisGame.TILE_WIDTH;
						player.homeY=j*thisGame.TILE_HEIGHT;
					}
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

			 // Tu código aquí
			this.powerPelletBlinkTimer++;
			if(this.powerPelletBlinkTimer==60){
				this.powerPelletBlinkTimer=0;
			}
			var i=0;
			var j;
			while(this.getMapTile(i,0)){
				j=0;
				while(this.getMapTile(i,j)){
					var val=this.getMapTile(i,j);
					
					if(val>=100 && val<200){
						ctx.fillStyle='blue';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==3){
						//powerball
						if (this.powerPelletBlinkTimer%60<30) {
							ctx.beginPath();
							ctx.moveTo(j*TILE_WIDTH,i*TILE_HEIGHT)
							ctx.fillStyle='red';
							ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
							ctx.closePath();
							ctx.fill();
						}
					}
					else if(val==2){
						//normalball
						ctx.beginPath();
						ctx.moveTo(j*TILE_WIDTH,i*TILE_HEIGHT)
						ctx.fillStyle='white';
						ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
						ctx.closePath();
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
					j++;
					
				}
				i++;
			}
		};


		this.isWall = function(row, col) {
			// Tu código aquí
			if (this.getMapTile(row,col)>=100 && this.getMapTile(row,col)<=199) {
				return true;
			}
			else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
				// Tu código aquí
				// Determinar si el jugador va a moverse a una fila,columna que tiene pared 
				// Hacer uso de isWall

				var posiblex2=possiblePlayerX+thisGame.TILE_WIDTH;
				var posibley2=possiblePlayerY+thisGame.TILE_HEIGHT;
				for (var j = col-1; j <=col+1; j++) {
					for (var i = row-1; i <=row+1; i++) {
						if (this.isWall(i,j)) {
							ahorax1=j*thisGame.TILE_WIDTH;
							ahoray1=i*thisGame.TILE_HEIGHT;
							ahorax2=j*thisGame.TILE_WIDTH+thisGame.TILE_WIDTH;
							ahoray2=i*thisGame.TILE_HEIGHT+thisGame.TILE_HEIGHT;
	       					var x_overlap = Math.max(0, Math.min(posiblex2, ahorax2) - Math.max(possiblePlayerX, ahorax1));
	       					var y_overlap = Math.max(0, Math.min(posibley2, ahoray2) - Math.max(possiblePlayerY, ahoray1));
	  						overlapArea = x_overlap * y_overlap;
							if(overlapArea>0){
								return true;
							}
						}
					}
				}
				return false;
		};

		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};

			// Tu código aquí
			//  Gestiona la recogida de píldoras

			// Tu código aquí (test9)
			//  Gestiona las puertas teletransportadoras
			var x=Math.floor(playerX/thisGame.TILE_WIDTH);
			var y=Math.floor(playerY/thisGame.TILE_HEIGHT);
			if (x==col && y==row) {
				if (this.getMapTile(row,col)==tileID['door-h']) {
					if (col==0 && x==0) {
						player.x=(this.lvlWidth-1)*thisGame.TILE_WIDTH;
					}
					else{
						player.x=thisGame.TILE_WIDTH;
					}
				}
				if (this.getMapTile(row,col)==tileID['door-v']) {
					if (row==0 && y==0) {
						player.y=(this.lvlHeight-1)*thisGame.TILE_HEIGHT;
					}
					else{
						player.y=thisGame.TILE_HEIGHT;
					}
				}
				if (this.getMapTile(row,col)==tileID['pellet']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }
				}
				if (this.getMapTile(row,col)==tileID['pellet-power']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }

				}
			}
		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	
	Pacman.prototype.move = function() {

		// Tu código aquí
		var newx=this.x+this.velX;
	    var newy=this.y+this.velY;
	    var row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    var col=Math.floor(newx/thisGame.TILE_WIDTH);
	    if(newx>w-this.radius*2 || newx<0){
	    	return;
		}
		if(newy>h-this.radius*2 || newy<0){
		    return;
		}
	    if (thisLevel.checkIfHitWall(newx,newy,row,col)) {
		    return;
		}
		this.y=newy;
		this.x=newx;
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		    thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		// ....

	};


     // Función para pintar el Pacman
    Pacman.prototype.draw = function(x, y) {
         
         // Pac Man
	    ctx.fillStyle='yellow';
        ctx.beginPath();
        ctx.moveTo(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2);
        if (this.velX>0) {
        	ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2,(Math.PI*this.angle1),true);
        }
        else if (this.velX<0) {
        	ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2-((180*Math.PI)/180),(Math.PI*this.angle1)-((180*Math.PI)/180),true);
        }
        else if (this.velY<0) {
        	ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2-((90*Math.PI)/180),(Math.PI*this.angle1)-((90*Math.PI)/180),true);
        }
        else if (this.velY>0) {
        	ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2+((90*Math.PI)/180),(Math.PI*this.angle1)+((90*Math.PI)/180),true);
        }
        ctx.closePath();
        ctx.fill();	  
	// tu código aquí	     
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
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
				var newx;
	    var newy;
	    var row;
	    var col;
		if(inputStates["left"]==true){
			newx=player.x-player.speed;
	    	newy=player.y;
	    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    	col=Math.floor(newx/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
			    player.velX=-player.speed;
			    player.velY=0;
			}
	    }
	    if(inputStates["right"]==true){
	    	newx=player.x+player.speed;
	    	newy=player.y;
	    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    	col=Math.floor(newx/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
		      	player.velX=player.speed;
		      	player.velY=0;
		    }
	    }
	    if(inputStates["up"]==true){
	    	newx=player.x;
	    	newy=player.y-player.speed;
	    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    	col=Math.floor(newx/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
			    player.velX=0;
			    player.velY=-player.speed;
			}
	    }
	    if(inputStates["down"]==true){
	    	newx=player.x;
	    	newy=player.y+player.speed;
	    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    	col=Math.floor(newx/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
			    player.velX=0;
			    player.velY=player.speed;
			}
	    }
	    if(inputStates["space"]==true){
	      console.log("pause");
    	}
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
	player.move();
        // Clear the canvas
    clearCanvas();
   
	thisLevel.drawMap();

 
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

    var reset = function(){
	// Tu código aquí
	// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
	// inicializa la posición inicial de Pacman tal y como indica el enunciado
		player.velX=player.speed;
	    player.velY=0;
		player.x=player.homeX;
		player.y=player.homeY;	
    };

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
		addListeners();

		reset();

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


test('Puertas teletransportadoras (i)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 459;
		player.y = 288;
		var row = 12;
		var col = 19;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta lateral derecha
		assert.ok(  player.x < 100 && player.y == 288 , "Pacman debe aparecer en la misma fila, pero en la puerta lateral izquierda" );
		done();
  }, 1000);

});

test('Puertas teletransportadoras (ii)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 21;
		player.y = 288;
		var row = 12;
		var col = 1;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta lateral izquierda 
		assert.ok(  player.x > 400 && player.y == 288 , "Pacman debe aparecer en la misma fila, pero en la puerta lateral derecha" );
		done();
  }, 2000);

});



test('Puertas teletransportadoras (iii)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 240;
		player.y = 21;
		var row = 1;
		var col = 10;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta superior  
		assert.ok(  player.x == 240 && player.y > 400 , "Pacman debe aparecer en la misma columna, pero en la puerta inferior" );

    		   done();
  }, 3000);

});

test('Puertas teletransportadoras (iv)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 240;
		player.y = 555;
		var row = 23;
		var col = 10;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta inferior
		assert.ok(  player.x == 240 && player.y < 30 , "Pacman debe aparecer en la misma columna, pero en la puerta superior" );

    		   done();
  }, 4000);

});
