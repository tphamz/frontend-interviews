class Game2048{
    #isStateChanged;
    #grid;
    #rowLen;
    #colLen;
    #maxScore;
    constructor(rowLength, colLength){
        this.#rowLen = rowLength;
        this.#colLen = colLength;
        this.#grid = [];
        for(let i=0; i<rowLength; i++){
            this.#grid.push([]);
            for(let j=0; j<colLength; j++)
                this.#grid.at(-1).push(0);
        }
    }
    
    #updateMaxScore(val){
        this.#maxScore = Math.max(this.#maxScore, val);
        if(this.#maxScore===2048) console.info("You win the game");
    }

    #emptySlots(){
        let res = [];
        for(let i=0; i<this.#rowLen; i++){
            for(let j=0; j<this.#colLen; j++)
                if(!this.#grid[i][j]) res.push([i,j]);
        }
        return res;
    }

    #isMergable(){
        for(let i=0; i<this.#rowLen; i++){
            for(let j=0; j<this.#colLen; j++){
                if(!this.#grid[i][j]) return true;
                if(i+1<this.#rowLen && this.#grid[i][j]===this.#grid[i+1][j]) return true;
                if(j+1<this.#colLen && this.#grid[i][j]===this.#grid[i][j+1]) return true;
            }
        }
        return false;
    }

    #reverse(){
        for(let i=0; i<this.#rowLen; i++)
            this.#grid[i] = this.#grid[i].reverse();
    }
    
    #transpose(){
        const grid = Array.from({length: this.#colLen}, ()=>[]);
        for(let i=0;i<this.#rowLen;i++){
            for(let j=0; j<this.#colLen; j++)
                grid[j][i] = this.#grid[i][j];
        }
        this.#grid = grid;
        [this.#rowLen, this.#colLen] = [this.#colLen, this.#rowLen];
    }

    #moveGrid(){
        for(let row of this.#grid)
            this.#moveRow(row);
    }

    #moveRow(row){
        const stack = [];
        let canMerged = true;
        for(let i=0; i<row.length; i++){
            if(!row[i]) continue;
            if(canMerged && stack.at(-1)===row[i]){
                canMerged = false;
                stack.push(stack.pop()+row[i]);
            }
            else{
                canMerged = true;
                stack.push(row[i]);
            }
        }

        for(let i=0; i<row.length; i++){
            const v = stack[i]||0;
            if(v===row[i]) continue;
            row[i] = v;
            this.#updateMaxScore(v);
            this.#isStateChanged = true;
        }
    }

    #moveLeft(){
        return this.#moveGrid();
    }

    #moveRight(){
        this.#reverse();
        this.#moveGrid();
        this.#reverse();    
    }

    #moveUp(){
        this.#transpose();
        this.#moveLeft();
        this.#transpose();
    }

    #moveDown(){
        this.#transpose();
        this.#moveRight();
        this.#transpose();
    }

    spawn(){
        const emptySlots = this.#emptySlots();
        if(!emptySlots.length){
            if(!this.#isMergable()) return console.error("You lost!");
            return;
        }
        const [row, col] = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        this.#grid[row][col] = Math.random()<0.9?2:4;
    }

    onMove(direction){
        this.#isStateChanged = false;
        try{
            switch(direction.toUpperCase()){
                case "LEFT": 
                    this.#moveLeft();
                    break;
                case "RIGHT": 
                    this.#moveRight();
                    break;
                case "UP": 
                    this.#moveUp();
                    break;
                case "DOWN": 
                    this.#moveDown();
                    break;
                default: 
                    throw new Error("Invalid move!");
            }
            if(this.#isStateChanged) this.spawn();
        }catch(err){
            console.error(err.message);
        }
    }
    
}