(function(){ 
    self.Board = function(width, heigth) {
        this.width = width;
        this.heigth = heigth;
        this.playing = false;
        this.gameOver = false;
        this.bars = [];
    }

    self.Board.prototype = {
        get elementos() {
            var elementos = this.bars;
            elementos.push(ball);
            return elementos;
        }
    }

})();

(function() {
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.heigth = board.heigth;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
})();

window.addEventListener("load", main);

function main() {
    var board = new Board(600, 400);
    var canvas = document.getElementById('canvas');
    var boardView = new BoardView(canvas, board);
}