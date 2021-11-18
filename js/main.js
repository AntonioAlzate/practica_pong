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

    this.board.bars.push(this);

    this.kind = "rectangle";
  };

  self.Bar.prototype = {
    down: function () {},
    up: function () {},
  };
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

self.addEventListener("load", main);

function main() {
  var board = new Board(600, 400);
  var bar = new Bar(20,50,15,50, board);
  var bar = new Bar(560,50,15,50, board);
  var canvas = document.getElementById('canvas');
  var boardView = new BoardView(canvas, board);

  boardView.draw();
}
