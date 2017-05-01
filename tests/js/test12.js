//
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

    const TILE_WIDTH=24, TILE_HEIGHT=24;
    var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost


	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;

		this.draw = function(){
			// Pintar cuerpo de phantom
			if(this.state!=Ghost.SPECTACLES){
				this.ctx.beginPath();
				this.ctx.moveTo(this.x,this.y+thisGame.TILE_HEIGHT);
				this.ctx.quadraticCurveTo(this.x+thisGame.TILE_WIDTH/2,this.y-thisGame.TILE_HEIGHT/2,this.x+thisGame.TILE_WIDTH,this.y+thisGame.TILE_HEIGHT);
				this.ctx.closePath();
				if (this.state==Ghost.NORMAL) {
				this.ctx.fillStyle=ghostcolor[this.id];
				}
				else if(this.state==Ghost.VULNERABLE && thisGame.ghostTimer<=100 && thisGame.ghostTimer%10==0){
					this.ctx.fillStyle=ghostcolor[5];
				}
				else if(this.state==Ghost.VULNERABLE){
					this.ctx.fillStyle=ghostcolor[4];
				}
				
				this.ctx.fill();
			}
			// Pintar ojos 
			this.ctx.beginPath();
			this.ctx.fillStyle="white";
			this.ctx.arc(this.x+thisGame.TILE_WIDTH/3,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/6,0,Math.PI*2,false);
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.arc(this.x+thisGame.TILE_WIDTH/1.5,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/6,0,Math.PI*2,false);
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.fillStyle="black";
			this.ctx.arc(this.x+thisGame.TILE_WIDTH/3,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/12,0,Math.PI*2,false);
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.arc(this.x+thisGame.TILE_WIDTH/1.5,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/12,0,Math.PI*2,false);
			this.ctx.fill();

			
			// test12 Tu código aquí
			// Asegúrate de pintar el phantom de un color u otro dependiendo del estado del phantom y de thisGame.ghostTimer
			// siguiendo el enunciado

		}; // draw

		this.move = function() {

				if (this.x%thisGame.TILE_WIDTH==0 && this.y%thisGame.TILE_HEIGHT==0) {
	    			var c=Math.floor(this.x/thisGame.TILE_WIDTH);
	    			var r=Math.floor(this.y/thisGame.TILE_HEIGHT);
	    			var soluciones=[];
	    			if (!thisLevel.isWall(r+1,c) && this.velY>=0 && thisLevel.getMapTile(r+1,c)!=20 && thisLevel.getMapTile(r+1,c)!=21) {
	    				soluciones.push([1,0]);
	    			}
	    			if (!thisLevel.isWall(r-1,c) && this.velY<=0 && thisLevel.getMapTile(r-1,c)!=20 && thisLevel.getMapTile(r-1,c)!=21) {
	    				soluciones.push([-1,0]);
	    			}
	    			if (!thisLevel.isWall(r,c+1) && this.velX>=0 && thisLevel.getMapTile(r,c+1)!=20 && thisLevel.getMapTile(r,c+1)!=21) {
	    				soluciones.push([0,1]);
	    			}
	    			if (!thisLevel.isWall(r,c-1) && this.velX<=0 && thisLevel.getMapTile(r,c-1)!=20 && thisLevel.getMapTile(r,c-1)!=21) {
	    				soluciones.push([0,-1]);
	    			}
	    			if (soluciones.length==0) {
	    				this.velX=-this.velX;
	    				this.velY=-this.velY;
	    			}
	    			else{
	    				var rand=Math.floor(Math.random()*soluciones.length);
	    				this.velX=soluciones[rand][1];
	    				this.velY=soluciones[rand][0];
	    				this.x+=this.velX;
	    				this.y+=this.velY;
	    			}
	    		}
	    		else{
	    			this.x+=this.velX;
	    			this.y+=this.velY;
	    		}
		};

	}; // fin clase Ghost

// static variables
Ghost.NORMAL = 1;
Ghost.VULNERABLE = 2;
Ghost.SPECTACLES = 3;

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
			if (this.map[row]==null) {
				return null;
			}
			return this.map[row][col];	
		};

		this.printMap = function(){
			// tu código aquí
		};

		this.loadLevel = function(){
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
						if (this.getMapTile(j,r)>=10 && this.getMapTile(j,r)<=13) {
							var phantom=ghosts[this.getMapTile(j,r)-10];
							phantom.homeX=r*thisGame.TILE_WIDTH;
							phantom.homeY=j*thisGame.TILE_HEIGHT;
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
					j++;
					
				}
				i++;
		}
	};


		this.isWall = function(row, col) {
			if (this.getMapTile(row,col)>=100 && this.getMapTile(row,col)<=199) {
				return true;
			}
			else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
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

		this.checkIfHit = function(playerX, playerY, x, y, holgura){
		
			var hx=Math.abs(playerX-x);
			var hy=Math.abs(playerY-y);
			if(hx<holgura && hy<holgura){
				return true;
			}
			else{
				return false;
			}	
		};


		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
					'door-v' : 21,
					'pellet-power' : 3,
					'pellet': 2
			};

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
					thisGame.ghostTimer=360;
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }

				}
			}
			// test12 TU CÓDIGO AQUÍ
			// Gestiona la recogida de píldoras de poder
			// (cambia el estado de los phantoms)

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
		//
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		thisLevel.checkIfHitSomething(this.x, this.y, row, col);
		// ....
		for (var i = 0; i <numGhosts; i++) {
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,thisGame.TILE_WIDTH/2)){
				console.log("Te han comido");
			}
		}

	};


     // Función para pintar el Pacman
    Pacman.prototype.draw = function(x, y) {
         
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
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0
	};

	var thisLevel = new Level(canvas.getContext("2d"));
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


    var updateTimers = function(){
	// tu código aquí (test12)
        // Actualizar thisGame.ghostTimer (y el estado de los phantoms, tal y como se especifica en el enunciado)
        
        if (thisGame.ghostTimer==0) {
        	estado=Ghost.NORMAL;
        }
        if(thisGame.ghostTimer>0){
        	estado=Ghost.VULNERABLE;
        	thisGame.ghostTimer--;
        }
        for (var i = 0; i < numGhosts; i++) {
        	if (ghosts[i].state !=Ghost.SPECTACLES) {
        		ghosts[i].state=estado;
        	}
        }
        
    };

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();

	// Tu código aquí
	for (var i = 0; i <numGhosts; i++) {
	    	ghosts[i].move();
	}

	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	// Tu código aquí
	// Pintar phantoms
	for (var i = 0; i <numGhosts; i++) {
	    	ghosts[i].draw();
	}

 
	player.draw();

	updateTimers();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    var addListeners = function(){
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

	    // Tu código aquí (test12)
	    // probablemente necesites inicializar los atributos de los phantoms
	    // (x,y,velX,velY,state, speed)
	    player.velX=player.speed;
	    player.velY=0;
		player.x=player.homeX;
		player.y=player.homeY;
		for (var i = 0; i < numGhosts; i++) {
			var phantom=ghosts[i];
			phantom.x=phantom.homeX;
			phantom.y=phantom.homeY;
			var velocidades= [[-phantom.speed,0],[phantom.speed,0],[0,phantom.speed],[0,-phantom.speed]];
			var rand=Math.floor(Math.random()*4);
			phantom.velX=velocidades[rand][0];
			phantom.velY=velocidades[rand][1];
			phantom.state=Ghost.NORMAL;
		}
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
        start: start,
		ghosts: ghosts,
        thisLevel: thisLevel
    };
};



var game = new GF();
game.start();


test('Cazando phantoms', function(assert) {

	// ponemos un power-pellet en 16,14, justo a la derecha de donde sale Pacman
	game.thisLevel.setMapTile(16,14,3);
	// esperamos unos segundos. Se supone que Pacman recoge la píldora de poder y los phantoms deben ponerse azules

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 2, "Los phantoms son vulnerables");
		}

		done();

	}, 3000);

});



test('Cazando phantoms (ii)', function(assert) {

	// A los 8 segundos, los phantoms deben volver a su color original 

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 1, "Los phantoms vuelven a ser normales");
		}

		done();

	}, 8000);

});

