enum TransactionType {
    CASH,
    CARD
}

enum EventType {
    TRANSACTION_FAIL,
    CANCEL,
    DISPENSE,
    WITHDRAW

}

type EventData = {
    type: EventType,
    message?: string,
    slotId?: number,
    amount?: number
}

class VendingSlot {
    private quantity: number;
    private price: number;
    private id: number;
    constructor(id: number, price: number, quantity: number) {
        this.id = id;
        this.price = price;
        this.quantity = quantity;
    }

    dispense() {
        if (!this.quantity) return 0;
        this.quantity--;
        return this.price;
    }

    supply(quantity: number) {
        this.quantity += quantity;
    }

    setPrice(price: number) {
        this.price = price;
    }

    getPrice() {
        return this.price;
    }

    getQuantity() {
        return this.quantity;
    }

    getId() {
        return this.id;
    }
}

class Transaction {
    slot: number;
    amount: number;
    transactionType: TransactionType;
    createdDate: string;
    constructor(slot: number, transactionType: TransactionType, amount: number) {
        this.slot = slot;
        this.transactionType = transactionType;
        this.amount = amount;
        this.createdDate = new Date().toLocaleString();
    }

    toString(): string {
        return `slot: ${this.slot} amount: ${this.amount} created Date ${this.createdDate}`
    }
}

interface Payment {
    transactionType: TransactionType;
    process(amount: number): any;
    cancel(): void;
}

class CashPayment implements Payment {
    transactionType: TransactionType;
    amount: number;
    constructor() {
        this.transactionType = TransactionType.CASH;
        this.amount = 0;
    }

    deposit(amount: number) {
        this.amount += amount;
    }

    cancel() {
        this.amount = 0;
    }

    async process(amount: number): Promise<void> {
        if (this.amount < amount) throw new Error("Inefficient amount");
        const ans = this.amount;
        this.amount -= amount;
    }
}

class CardTransaction {
    constructor() { }
    async process(card: string, amount: number): Promise<void> {
    }
}

class CardPayment implements Payment {
    transactionType: TransactionType;
    amount: number;
    private card: string;
    private cardTransaction: CardTransaction;

    constructor(card: string) {
        this.amount = 0;
        this.transactionType = TransactionType.CARD;
        this.card = card;
        this.cardTransaction = new CardTransaction();
    }

    cancel() {
        this.card = "";
    }

    async process(amount: number) {
        this.cardTransaction.process(this.card, amount);
    }
}


class VendingMachine {
    private isLoading: boolean;
    private slots: VendingSlot[];
    private transactions: Transaction[];
    private totalAmount: number;
    private cashAmount: number;
    private payment: CardPayment | CashPayment;
    private observer: (data: EventData) => any;

    constructor() {
        this.slots = [];
        this.transactions = [];
        this.cashAmount = 0;
        this.totalAmount = 0;
        this.payment = new CashPayment();
        this.observer = (data: EventData) => { };
        this.isLoading = false;
    }

    set registerObserver(callback: (data: EventData) => any) {
        this.observer = (data: EventData) => callback(data);
    }

    setInitialAmount(amount: number) {
        this.cashAmount = amount;
        this.totalAmount += amount;
    }

    supply(slotId: number, price: number, quantity: number) {
        const slot = this.slots[slotId] || new VendingSlot(slotId, price, 0);
        slot.setPrice(price);
        slot.supply(quantity);
        this.slots[slotId] = slot;
    }

    deposit(amount: number) {
        if (!(this.payment instanceof CashPayment)) this.payment = new CashPayment();
        this.payment.deposit(amount);
    }

    swipe(card: string) {
        this.cancel();
        this.payment = new CardPayment(card);
    }

    async purchase(slotId: number): Promise<number> {
        if (this.isLoading) return 0;
        this.isLoading = true;
        const slot = this.slots[slotId];
        let remain = 0;
        try {
            if (!this.payment) throw new Error("Select a payment");
            if (slot.getQuantity() === 0) throw new Error("Out of stock");
            await this.payment.process(slot.getPrice());
            this.transactions.push(new Transaction(slotId, this.payment.transactionType, slot.getPrice()));
            slot.dispense();
            this.observer({ type: EventType.DISPENSE, amount: slot.getPrice(), slotId: slot.getId() });
            if (this.payment.transactionType === TransactionType.CASH) this.cashAmount += slot.getPrice();
            this.totalAmount += slot.getPrice();
            remain = this.payment.amount;
            this.payment.cancel();
        } catch (err: any) {
            this.observer({ type: EventType.TRANSACTION_FAIL, message: err.message });
        }
        this.isLoading = false;
        return remain;
    }

    cancel() {
        if (!this.payment) return;
        const amount = this.payment.amount;
        this.observer({ type: EventType.CANCEL, amount })
        this.payment.cancel();
    }

    withdrawal(): Transaction[] {
        const transactions = this.transactions;
        this.transactions = [];
        this.observer({ type: EventType.WITHDRAW, amount: this.cashAmount });
        this.totalAmount = 0;
        this.cashAmount = 0;
        return transactions;
    }
}