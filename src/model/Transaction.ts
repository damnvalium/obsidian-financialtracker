import { ModelAccount } from "./Account";
import { ModelConsumer } from "./Consumer";
import { Model } from "./Model";
import { ModelPerson } from "./Person";

class ModelTransaction extends Model {
    readonly id: number;
    amount: number;
    description: string;
    timestamp: number;
    sender: ModelAccount | ModelPerson | null;
    receiver: ModelAccount | ModelPerson | ModelConsumer | null;

    constructor(id: number, amount: number, description: string, timestamp: number, sender: ModelAccount | ModelPerson | null, receiver: ModelAccount | ModelPerson | ModelConsumer | null) {
        super();
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    static getById(id: number): ModelTransaction {
        const res = ModelTransaction.sqlite.exec(`
            SELECT *
            FROM Transaction 
            WHERE id = ${id}`
        );

        // Check sender type
        let sender = null;
        if (res[0].values[0][4] != null) 
            sender = ModelAccount.getById(res[0].values[0][4] as number);
        else if (res[0].values[0][6] != null)
            sender = ModelPerson.getById(res[0].values[0][6] as number);

        // Check receiver type
        let receiver = null;
        if (res[0].values[0][5] != null)
            receiver = ModelAccount.getById(res[0].values[0][5] as number);
        else if (res[0].values[0][7] != null)
            receiver = ModelPerson.getById(res[0].values[0][7] as number);
        else if (res[0].values[0][9] != null)
            receiver = ModelConsumer.getById(res[0].values[0][8] as number);

        return new ModelTransaction(
            res[0].values[0][0] as number,
            res[0].values[0][1] as number,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number,
            sender,
            receiver
        );
    }

    save(): void {
        ModelTransaction.sqlite.exec(`
            UPDATE Transaction SET 
            amount = ${Math.trunc(this.amount * 100)}, 
            description = "${this.description}", 
            timestamp = ${this.timestamp}, 
            sender_Account = ${this.sender instanceof ModelAccount ? this.sender.id : "null"},
            receiver_Account = ${this.receiver instanceof ModelAccount ? this.receiver.id : "null"},
            sender_Person = ${this.sender instanceof ModelPerson ? this.sender.id : "null"},
            receiver_Person = ${this.receiver instanceof ModelPerson ? this.receiver.id : "null"},
            sender_Consumer = ${this.sender instanceof ModelConsumer ? this.sender.id : "null"},
            receiver_Consumer = ${this.receiver instanceof ModelConsumer ? this.receiver.id : "null"}
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelTransaction.sqlite.exec(`
            DELETE FROM Transaction 
            WHERE id = ${this.id}`
        );
    }
}