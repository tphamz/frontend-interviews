enum SlotType {
    SMALL = 0, //two wheels 
    MEDIUM = 1, // 4 wheels
    LARGE = 2 // the rest
}

class Slot {
    id: number;
    available: boolean;
    assignedTime: number;
    constructor(id: number, available: boolean = true, assignedTime: number = 0) {
        this.id = id;
        this.available = available;
        this.assignedTime = assignedTime;
    }

    assign(): boolean {
        if (!this.available) return false;
        this.available = false;
        this.assignedTime = Date.now();
        return true;
    }

    unassign() {
        this.available = true;
        this.assignedTime = 0;
    }
}

class Ticket {
    floor: number;
    slot: number;
    type: SlotType;
    time: number;
    rate: number;
    constructor(floor: number, type: SlotType, slot: number, time: number, rate: number) {
        this.floor = floor;
        this.type = type;
        this.slot = slot;
        this.time = time;
        this.rate = rate;
    }
}


class Floor {
    private slots: Slot[][];
    id: number;
    constructor(id: number, capacities: number[]) {
        this.id = id;
        this.slots = [];
        for (let size of capacities)
            this.slots.push(Array.from({ length: size }, (_, index) => new Slot(index)))
    }

    assign(type: SlotType): Slot | null {
        for (let slot of this.slots[type])
            if (slot.assign()) return slot;
        return null;
    }

    unassign(type: SlotType, id: number): number {
        const slot = this.slots[type][id];
        if (slot.available) return 0;
        const timeStamp = slot.assignedTime;
        slot.unassign();
        return Math.ceil((Date.now() - timeStamp) / 3600000);
    }
}


class ParkingService {
    private floors: Floor[];
    private rates: number[];
    constructor(floors: number = 3, capacity: number[] = [5, 50, 5], rates: number[] = [1, 1, 1]) {
        this.floors = Array.from({ length: floors }, (_, index) => new Floor(index, capacity));
        this.rates = rates;
    }

    assign(type: SlotType) {
        for (let floor of this.floors) {
            const slot = floor.assign(type);
            if (slot) return new Ticket(floor.id, type, slot.id, slot.assignedTime, this.rates[type]);
        }
        return null;
    }

    unassign(ticket: Ticket) {
        const floor = this.floors[ticket.floor];
        return (floor.unassign(ticket.type, ticket.slot) * ticket.rate);
    }
}