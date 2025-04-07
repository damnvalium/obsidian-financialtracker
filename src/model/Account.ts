import { Model } from "./Model";

export class ModelAccount extends Model {
    readonly id: number;
    name: string;
    balance: number;

    private constructor(id: number, name: string, balance: number) {
        super();
        this.id = id;
        this.name = name;
        this.balance = balance / 100;
    }

    static getById(id: number): ModelAccount {
        const res = ModelAccount.sqlite.exec(`
            SELECT * 
            FROM Account 
            WHERE id = ${id}`
        );
        return new ModelAccount(
            res[0].values[0][0] as number,
            res[0].values[0][1] as string,
            res[0].values[0][2] as number,
        );
    }

    save(): void {
        ModelAccount.sqlite.exec(`
            UPDATE Account SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelAccount.sqlite.exec(`
            DELETE FROM Account 
            WHERE id = ${this.id}`
        );
    }
}