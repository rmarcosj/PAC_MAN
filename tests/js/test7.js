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
					j++;
					ctx.closePath();
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

		// tu código aquí
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
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
    // Pac Man	    
	// tu código aquí	
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


test('checkIfHitWall bien implementado', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		var x = 315, y = 384, speed = 5, nearestRow = 16, nearestCol = 13;
		assert.ok( thisLevel.checkIfHitWall( x, y - speed, nearestRow, nearestCol ) == true , "entrar demasiado pronto por la primera salida hacia arriba de la pos. original" );
		x = 312; 
		assert.ok( thisLevel.checkIfHitWall( x, y - speed, nearestRow, nearestCol ) == false , "entrar OK por la primera salida hacia arriba de la pos. original" );	
		x = 240, y = 144, nearestRow = 6, nearestCol = 10;
		assert.ok( thisLevel.checkIfHitWall( x - speed, y , nearestRow, nearestCol ) == false , "apertura horizontal superior izquierda, entrando correctamente hacia la izquierda, no hay pared");
		y = 147;			
		assert.ok( thisLevel.checkIfHitWall( x - speed, y , nearestRow, nearestCol ) == true , "apertura horizontal superior izquierda, entrando demasiado tarde hacia la izquierda, hay pared");
		done();
	}, 1000);

});

