(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.gameOver = false;
    this.bars = [];
    this.ball = null;
  };

  self.Board.prototype = {
    get elementos() {
      var elementos = this.bars.map(function (bar) {
        return bar;
      });
      elementos.push(this.ball);
      return elementos;
    },
  };
})();

(function () {
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 3;
    this.board = board;
    this.direction = 1;

    board.ball = this;
    this.kind = "circle";
  }

  self.Ball.prototype = {
    move: function(){
      this.x += (this.speed_x * this.direction);
      this.y += (this.speed_y);
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
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
  };
})();

(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
    clean: function () {
      this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    },
    draw: function () {
      for (var i = this.board.elementos.length - 1; i >= 0; i--) {
        var el = this.board.elementos[i];

        draw(this.ctx, el);
      }
    },
    play: function () {
      if(this.board.playing){
        
        this.clean();
        this.draw();
        this.board.ball.move();
      }
    }
  };

  function draw(ctx, elemento) {
    switch (elemento.kind) {
      case "rectangle":
        ctx.fillRect(elemento.x, elemento.y, elemento.width, elemento.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(elemento.x, elemento.y, elemento.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();

var board = new Board(600, 400);
var bar = new Bar(20, 50, 15, 50, board);
var bar2 = new Bar(560, 50, 15, 50, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

document.addEventListener("keydown", function (ev) {
  if (ev.keyCode == 38) {
    ev.preventDefault();
    bar.up();
  } else if (ev.keyCode == 40) {
    ev.preventDefault();
    bar.down();
  } else if (ev.keyCode == 87) {
    ev.preventDefault();
    bar2.up();
  } else if (ev.keyCode == 83) {
    ev.preventDefault();
    bar2.down();
  } else if (ev.keyCode == 32) {
    board.playing = !board.playing;
  }

  console.log(bar.toString());
});

boardView.draw();

window.requestAnimationFrame(controller);

function controller() {
  boardView.play();
  window.requestAnimationFrame(controller);
}
