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
    this.bounceAngle = 0;
    this.maxBounceAngle = Math.PI / 12;
    this.speed = 3;

    board.ball = this;
    this.kind = "circle";
  };

  self.Ball.prototype = {
    move: function () {
      this.x += this.speed_x * this.direction;
      this.y += this.speed_y;

      // Colisión con paredes verticales de acuerdo al tamaño del board
			if (this.x <= (this.board.width - this.board.width) + 10) {
				this.speed_x = -this.speed_x;
				this.bounceAngle = -this.bounceAngle;
			}
			if (this.x >=  this.board.width - 10) {
				this.speed_x = -this.speed_x;
				this.bounceAngle = -this.bounceAngle;
			}

      // Colisión con paredes horizontales de acuerdo al tamaño del board
			if (this.y <= (this.board.height - this.board.height) + 10) {
				this.speed_y = -this.speed_y;
				this.bounceAngle = -this.bounceAngle;
			}
			if (this.y >= this.board.height - 10) {
				this.speed_y = -this.speed_y;
				this.bounceAngle = -this.bounceAngle;
			}
    },
    get width() {
      return this.radius * 2;
    },
    get height() {
      return this.radius * 2;
    },
    collision: function (bar) {
      // Realiza la accion de rebote al colisionar
      var relativeIntersectY = bar.y + bar.height / 2 - this.y;

      var normalizadIntersectY = relativeIntersectY / (bar.height / 2);

      this.bounceAngle = normalizadIntersectY * this.maxBounceAngle;

      this.speed_y = this.speed * -Math.sin(this.bounceAngle);
      this.speed_x = this.speed * Math.cos(this.bounceAngle);

      if (this.x > this.board.width / 2) this.direction = -1;
      else this.direction = 1;
    },
  };
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
    checkCollisions: function () {
      for (let i = this.board.bars.length - 1; i >= 0; i--) {
        var bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }
    },
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.checkCollisions();
        this.board.ball.move();
      }
    },
  };

  // Revisa si a colisiona con b
  function hit(a, b) {
    var hit = false;

    // colisiones horizontales
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      //Colisiones verticales
      if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
    }

    // Colisión de a con b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
    }

    // Colision b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
    }

    return hit;
  }

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
