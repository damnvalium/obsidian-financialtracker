import { Model } from "./Model";

export class ModelAccount extends Model {
    readonly id: number;
    name: string;
    balance: number;
    last_usage: number;

    private constructor(id: number, name: string, balance: number, last_usage: number) {
        super();
        this.id = id;
        this.name = name;
        this.balance = balance / 100;
        this.last_usage = last_usage;
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
            res[0].values[0][3] as number,
        );
    }

    static getList(): ModelAccount[] {
        const res = ModelAccount.sqlite.exec(`
            SELECT * 
            FROM Account
            ORDER BY last_usage DESC
        `);
        const accounts: ModelAccount[] = [];
        for (const account of res[0].values)
            accounts.push(new ModelAccount(
                account[0] as number,
                account[1] as string,
                account[2] as number,
                account[3] as number,
            ));
        return accounts;
    }

    save(): void {
        ModelAccount.sqlite.exec(`
            UPDATE Account SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)},
            last_usage = ${this.last_usage} 
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