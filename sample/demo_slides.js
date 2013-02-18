$(document).ready(function() {

  Crafty.init(640,480).canvas.init();
  Crafty.background("black");

  var player1 = Crafty.e("2D, Canvas, Color")
          .color("red")
          .attr({w:50, h:50});


  var player2 = Crafty.e("2D, Canvas, Color")
          .color("green")
          .attr({w:50, h:50, x: 50, y:50});

  /* Collision Code */
  player1.addComponent("Collision").bind('Moved', function(from) {
    if(this.hit('2D')) {
       this.attr({x: from.x, y:from.y});
    }
  });
  player2.addComponent("Collision").bind('Moved', function(from) {
    if(this.hit('2D')) {
       this.attr({x: from.x, y:from.y});
    }
  });



  player1.addComponent("Multiway").multiway(3,{ 
          W: -90, S: 90, D: 0, A: 180});

  player2.addComponent("Multiway").multiway(10,{ 
          UP_ARROW: -90, DOWN_ARROW: 90, 
          RIGHT_ARROW: 0, LEFT_ARROW: 180});
});
