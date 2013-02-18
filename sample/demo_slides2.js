
  var player = Crafty.e("2D, Canvas, Color, Player")
       .color("white")
       .attr({w:50, h:50, x:126, y:0});

  player.addComponent('Gravity').gravity("Floor");
  player.addComponent("Twoway").twoway(5)
  player.addComponent("Collision").collision();


  var floor = Crafty.e("2D, Canvas, Color, Collision, Floor")
		.color("blue")
		.attr({h:30, w:400, x:0, y:380 })
		.collision()

  var block = Crafty.e("2D, Canvas, Color, Collision, Block")
		.color("red")
		.attr({h:30, w:400, x:50, y:200 })
		.collision()

  player.onHit("Block",function(hit) {
    this._falling = false;
    this.attr({x: this._x + hit[0].normal.y * hit[0].overlap * 1.1, 
               y: this._y + hit[0].normal.x * hit[0].overlap * 1.1});
  });


