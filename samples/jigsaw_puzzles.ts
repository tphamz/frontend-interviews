enum Edge {
    FLAT = 0,
    MALE = 1,
    FEMALE = 2
}

class Piece {
    private edges: Edge[];
    private id: number;
    constructor(id: number, top: Edge, right: Edge, bottom: Edge, left: Edge) {
        this.id = id;
        this.edges = [top, right, bottom, left];
    }
    rotate() {
        const [top, right, bottom, left] = this.edges;
        this.edges = [left, top, right, bottom];
    }

    getEdge(pos: number): Edge { return this.edges[pos] }

}


class Board {
    private rows: number;
    private columns: number;
    private board: (Piece | null)[][];
    private completeCount: number;
    private condition: (pieces: (Piece | null)[], current: Piece) => boolean;
    constructor(rows: number, columns: number, condition = (p: (Piece | null)[], current: Piece) => true) {
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.completeCount = 0;
        this.reset();
        this.condition = condition;
    }

    place(r: number, c: number, current: Piece): boolean {
        const neighbors: (Piece | null)[] = [
            r > 0 ? this.board[r - 1][c] : null,
            c < this.columns - 1 ? this.board[r][c + 1] : null,
            r < this.rows - 1 ? this.board[r + 1][c] : null,
            c > 0 ? this.board[r][c - 1] : null
        ];
        if (!this.compare(neighbors, current)) return false;
        this.completeCount++;
        this.board[r][c] = current;
        return true;
    }

    remove(r: number, c: number) {
        this.completeCount--;
        this.board[r][c] = null;
    }

    generate(): Piece[] {
        this.reset();
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const [top, right, bottom, left] = this.generatePiece(i, j);
                this.board[i][j] = new Piece(i * this.columns + j, top, right, bottom, left);
            }
        }

        const hand: Piece[] = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const piece = this.board[i][j];
                const rotations = Math.floor(Math.random() * 4);
                for (let r = 0; r < rotations; r++) piece!.rotate();
                hand.push(piece!)
            }
        }
        this.reset();
        return this.shuffle(hand);
    }

    private shuffle(pieces: Piece[]): Piece[] {
        for (let i = pieces.length; i > 0; i--) {
            const index = Math.floor(Math.random() * i);
            const tmp = pieces[index];
            pieces[index] = pieces[i - 1];
            pieces[i - 1] = tmp;
        }
        return pieces;
    }

    private generatePiece(i: number, j: number): Edge[] {
        const top: Edge = i - 1 < 0 ? Edge.FLAT : this.generateEdge(i - 1, j, 2);
        const right: Edge = j + 1 === this.columns ? Edge.FLAT : this.generateEdge(i, j + 1, 3);
        const bottom: Edge = i + 1 === this.rows ? Edge.FLAT : this.generateEdge(i + 1, j, 0);
        const left: Edge = j - 1 < 0 ? Edge.FLAT : this.generateEdge(i, j - 1, 1);
        return [top, right, bottom, left];
    }

    private generateEdge(i: number, j: number, pos: number) {
        if (this.board[i][j]) return Edge.MALE + Edge.FEMALE - this.board[i][j].getEdge(pos);
        return Math.random() > 0.5 ? Edge.MALE : Edge.FEMALE;
    }

    reset() {
        this.board = Array.from({ length: this.rows }, () => Array.from({ length: this.columns }, () => null));
        this.completeCount = 0;
    }

    isComplete() {
        return this.completeCount === this.rows * this.columns;
    }

    protected compare(p: (Piece | null)[], current: Piece) {
        try {
            return this.condition(p, current);
        } catch (err) {
            return false;
        }
    }
}



function condition(neighbors: (Piece | null)[], current: Piece) {
    const [top, right, bottom, left] = neighbors;
    const total = Edge.FEMALE + Edge.MALE;
    if (!top && !right && !bottom && !left) return false;
    return (top ? (current.getEdge(0) === total - top.getEdge(2)) : true) &&
        (right ? (current.getEdge(1) === total - right.getEdge(3)) : true) &&
        (bottom ? (current.getEdge(2) === total - bottom.getEdge(0)) : true) &&
        (left ? (current.getEdge(3) === total - left.getEdge(1)) : true)
}

class JigsawPuzzleGame {
    private board: Board;
    private pieces: Piece[];
    constructor(row: number, col: number) {
        this.board = new Board(row, col, condition);
        this.pieces = this.board.generate();
    }

    place(r: number, c: number, piece: Piece) {
        for (let i = 0; i < 4; i++) {
            if (this.board.place(r, c, piece)) return true;
            piece.rotate();
        }
        return false;
    }

    isComplete(): boolean {
        return this.board.isComplete();
    }


}