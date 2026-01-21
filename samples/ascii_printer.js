class Tile{
    coord;
    deletedCells;
    value;
    constructor(from, to, value){
        this.coord = [from, to];
        this.deletedCells  = new Set();
        this.value = value;
    }
    
    deleteCells(from, to){
        const [[x1,y1], [x2,y2]] = this.coord;
        for(let i=from[1]; i<=to[1]; i++){
            for(let j=from[0];j<=to[0];j++){
                if(i>=y1 && i<=y2 &&  j>=x1 && j<=x2)
                    this.deletedCells.add(`${j},${i}`);
            }
        }
    }    
    
    move(offsetX, offsetY){
        const [[x1,y1], [x2,y2]] = this.coord;
        this.coord = [[x1+offsetX, y1+offsetY], [x2+offsetX, y2+offsetY]];
        for(let key of Array.from(this.deletedCells.keys())){
            const [x,y] = key.split(",");
            this.deletedCells.delete(key);
            this.deletedCells.add(`${parseInt(x)+offsetX},${parseInt(y)+offsetY}`);
        }
    }
}


class Board{
    #tiles;
    #histories;
    #rows;
    #cols;
    // #board;
    constructor(rows, cols){
        this.#tiles = [];
        this.#rows = rows;
        this.#cols = cols; 
        // this.#board = Array.from({length:rows}, ()=>Array.from({length:cols}, ()=>""));
    }
    
    #initBoard(){
        return Array.from({length:this.#rows}, ()=>Array.from({length:this.#cols}, ()=>" "));
    }
    
    #printBoard(board){
        let res = "";
        for(let i=0; i<board.length; i++){
            res+=board[i].join(" ") + "\n";
        }
        return res;
    }
    
    #findTileIndex(x,y){
        for( let i=this.#tiles.length-1; i>=0; i--){
            const [[x1,y1],[x2,y2]] = this.#tiles[i].coord;
            if(x1<=x && x<=x2 && y1<=y && y<=y2 && !this.#tiles[i].deletedCells.has(`${x},${y}`)) return i;
        }
        return -1;
    }
    
    printCanvas(){
       const board = this.#initBoard();
       for(let tile of this.#tiles){
            let [[x1,y1], [x2,y2]] = tile.coord;
            for(let i=y1; i<=y2; i++){
                for(let j=x1;j<=x2;j++){
                    if(tile.deletedCells.has(`${j},${i}`)) continue;
                    board[i][j] = tile.value;
                }
            }
       }
        console.log(this.#printBoard(board));
    }
    
    
    drawRectangle(from, to, value){
        this.#tiles.push(new Tile(from, to, value));
    }
    
    dragAndDrop(from, to){
        const index = this.#findTileIndex(from[0], from[1]);
        if(index===-1) return;
        const tile = this.#tiles[index];
        tile.move(to[0]-from[0], to[1]-from[1]);
    }
    
    eraseArea(from, to){
        for(let tile of this.#tiles){
            tile.deleteCells(from, to);
        }
    }
    
    bringToFront(postition){
        const index = this.#findTileIndex(postition[0], postition[1]);
        if(index===-1) return;
        const tmp = this.#tiles.at(-1);
        this.#tiles[this.#tiles.length-1] = this.#tiles[index];
        this.#tiles[index] = tmp;
    }
}


const board = new Board(6, 10);
board.drawRectangle([1,1],[4,4], "L");
board.drawRectangle([6,1],[8,3], "R")
board.printCanvas();

// dragging preserves existing draw order
board.dragAndDrop([2,3], [5,3]);
board.printCanvas();

// rectangles behind others are also erased
board.drawRectangle([3,3],[9,4],"#");
board.eraseArea([6,2], [6,4]);
board.printCanvas();

// rectangles are visible through erased areas
board.dragAndDrop([7,2], [7,4]);
board.printCanvas();

board.bringToFront([6,3]);
board.printCanvas();
