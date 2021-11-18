(function () {
  self.Board = function (width, heigth) {
    this.width = width;
    this.heigth = heigth;
    this.playing = false;
    this.gameOver = false;
    this.bars = [];
    this.ball = null;
  };

  self.Board.prototype = {
    get elementos() {
      var elementos = this.bars;
      elementos.push(this.ball);
      return elementos;
    }
  }
})();

(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    this.speed = 10;

    this.board.bars.push(this);

    this.kind = "rectangle";
  };

  self.Bar.prototype = {
    down: function () {
        this.y += this.speed;
    },
    up: function () {
        this.y -= this.speed;
    },
    toString: function(){
        return "x: " + this.x + " y: " + this.y;
    }
  }
})();

(function() {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.heigth = board.heigth;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
      draw: function(){
          for(var i = this.board.elementos.length -1; i>=0; i--){
            var el = this.board.elementos[i];
            
            draw(this.ctx, el);
          };
      }
  };

  function draw(ctx, elemento) {
    if (elemento !== null && elemento.hasOwnProperty("kind")) {
      switch (elemento.kind) {
        case "rectangle":
          ctx.fillRect(elemento.x, elemento.y, elemento.width, elemento.height);
          break;
      }
    }
  };
})();

var board = new Board(600, 400);
var bar = new Bar(20,50,15,50, board);
var bar = new Bar(560,50,15,50, board);
var canvas = document.getElementById('canvas');
var boardView = new BoardView(canvas, board);

document.addEventListener("keydown", function(ev) {
    if(ev.keyCode == 38){
        bar.up();
    }
    else if(ev.keyCode == 40){
        bar.down();
    }

    console.log(bar.toString());
});

self.addEventListener("load", main);

function main() {

  boardView.draw();
}
