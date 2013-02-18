/*  RPG test 
    Jarryd Novotni and Ivan Savov
	Feb 2013
	
*/

window.onload = function() {
	
	var canvasX, canvasY, numTilesX, numTilesY;
	
	canvasX = 800;
	canvasY = 600;
	numTilesX = canvasX / 16.0;
	numTilesY = canvasY / 16.0;
	
	//start crafty
	Crafty.init(canvasX, canvasY);
	Crafty.canvas();
	
	//turn the sprite map into usable components
	Crafty.sprite(16, "sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2],
		player: [0,3]
	});
	
	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < numTilesX; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < numTilesY; j++) {
				grassType = Crafty.randRange(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});
				
				//1/50 chance of drawing a flower and only within the bushes
				if(i > 0 && i < 24 && j > 0 && j < 19 && Crafty.randRange(0, 50) > 49) {
					Crafty.e("2D, DOM, flower, Animate")
						.attr({x: i * 16, y: j * 16})
						.animate("wind", 0, 1, 3)
						.bind("enterframe", function() {
							if(!this.isPlaying())
								this.animate("wind", 80);
						});
				}
			}
		}
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < numTilesX; i++) {
			Crafty.e("2D, Canvas, Solid, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, Solid, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 304, z: 2});
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 2; i < 18; i++) {
			Crafty.e("2D, DOM, Solid, bush"+Crafty.randRange(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, Solid, bush"+Crafty.randRange(1,2))
				.attr({x: 384, y: i * 16, z: 2});
		}

		
		Crafty.e("2D, Canvas, Solid, bush1")
			.attr({x: canvasX/4, y: canvasY/4, z: 2});


	}


	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
		generateWorld();
		
		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,
			
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(this.isDown("RIGHT_ARROW")) this.x += this._speed; 
					else if(this.isDown("LEFT_ARROW")) this.x -= this._speed; 
					else if(this.isDown("UP_ARROW")) this.y -= this._speed;
					else if(this.isDown("DOWN_ARROW")) this.y += this._speed;
				});
				
				return this;
			}
		});
		
		//create our player entity with some premade components
		player = Crafty.e("2D, Canvas, player, Controls, CustomControls, Animate, Collision")
			.attr({x: 180, y: 200, z: 1})
			.CustomControls(2)
			.animate("walk_left", 6, 3, 8)
			.animate("walk_right", 9, 3, 11)
			.animate("walk_up", 3, 3, 5)
			.animate("walk_down", 0, 3, 2)
			.bind("enterframe", function(e) {
				if(this.isDown("LEFT_ARROW")) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 10);
				} else if(this.isDown("RIGHT_ARROW")) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10);
				} else if(this.isDown("UP_ARROW")) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10);
				} else if(this.isDown("DOWN_ARROW")) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10);
				}
			}).bind("keyup", function(e) {
				this.stop();
			})
			.collision()
			.onHit("Solid", function(){
				if(this.isDown("RIGHT_ARROW")) this.x -= this._speed; 
				else if(this.isDown("LEFT_ARROW")) this.x += this._speed; 
				else if(this.isDown("UP_ARROW")) this.y += this._speed;
				else if(this.isDown("DOWN_ARROW")) this.y -= this._speed;
				console.log("solid hit man");
				//this.stop();
			})
			/*.onHit("wall_left", function() {
				this.x += this._speed;
				this.stop();
			}).onHit("wall_right", function() {
				this.x -= this._speed;
				this.stop();
			}).onHit("wall_bottom", function() {
				this.y -= this._speed;
				this.stop();
			}).onHit("wall_top", function() {
				this.y += this._speed;
				this.stop();
			});*/
	});
};