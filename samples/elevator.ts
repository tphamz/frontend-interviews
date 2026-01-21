enum Direction {
    MOVING_DOWN = -1,
    IDLE = 0,
    MOVING_UP = 1,
}

enum State {
    DOOR_CLOSE = 0,
    DOOR_OPEN = 1,
    MANTANCE = 2
}

class Elevator {
    private id: number;
    private floor: number;
    private state: State;
    private direction: Direction;
    private requests: Set<number>;
    private floors: number;
    private observers: ((id: number, floor: number, state: State, direction: Direction) => any)[];
    timeoutRef: any;

    constructor(id: number, floors: number) {
        this.id = id;
        this.floors = floors;
        this.requests = new Set<number>();
        this.observers = [];
        this.floor = 0;
        this.state = State.DOOR_CLOSE;
        this.direction = Direction.IDLE;

    }

    set observer(observer: (id: number, floor: number, state: State, direction: Direction) => any) {
        this.observers.push(observer);
    }

    get currentFloor() { return this.floor }

    get currentState() { return this.state }

    get currentDirection() { return this.direction }

    request(direction: Direction, floor: number) {
        this.direction = direction;
        this.requests.add(floor);
        this.move();
    }

    private move() {
        this.notify();
        if (this.timeoutRef) clearTimeout(this.timeoutRef);
        this.timeoutRef = null;
        if (!this.requests.size) {
            if (this.floor > 0) return this.request(Direction.MOVING_DOWN, 0);
            return this.direction = Direction.IDLE;
        }
        let self = this;
        if (this.requests.has(this.floor)) {
            this.state = State.DOOR_OPEN;
            this.requests.delete(this.currentFloor);
            this.notify();
            this.timeoutRef = setTimeout(() => {
                self.state = State.DOOR_CLOSE;
                self.move();
            }, 3000);
            return;
        }
        this.timeoutRef = setTimeout(() => {
            self.floor += this.direction;
            self.move();
        }, 3000);
    }

    notify() {
        for (let observer of this.observers)
            observer(this.id, this.floor, this.state, this.direction);
    }
}


class ElevatorControl {
    private floors: number;
    private elevators: Elevator[];
    private id: number; //current floor
    private queue: Direction[];
    constructor(id: number, floors: number) {
        this.id = id;
        this.floors = floors;
        this.elevators = [];
        this.queue = [];
    }

    registerElevator() {
        const elevator = new Elevator(this.elevators.length, this.floors);
        elevator.observer = (id: number, floor: number, state: State, direction: Direction) => this.consume(id, floor, state, direction);
        this.elevators.push(elevator);
    }

    private consume(id: number, floor: number, state: State, direction: Direction) {
        if (state === State.DOOR_CLOSE && direction === Direction.IDLE) {
            const v: Direction | null = this.queue.unshift();
            if (v) return this.request(v);
        }
    }

    request(direction: Direction) {
        let self = this;
        const elevator = this.findAvailable(direction);
        if (elevator) return elevator.request(direction, this.id);
        for (let item of this.queue)
            if (item === direction) return;
        this.queue.push(direction);
    }


    private findAvailable(direction: number): Elevator | null {
        let ans = null, min = this.floors;
        for (let elevator of this.elevators) {
            if (elevator.currentDirection === Direction.IDLE) return elevator;
            if (elevator.currentDirection !== direction) continue;
            const v = (this.id - elevator.currentFloor) * direction;
            if (v >= 0 && min >= v) {
                ans = elevator;
                min = v;
            }
        }
        return ans;
    }

}