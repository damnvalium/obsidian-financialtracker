import { Model } from "./Model";

export class ModelConfiguration extends Model {

    static getDefaultAccount(): number {
        const res = super.sqlite.exec(`
            SELECT *
            FROM Configuration
            WHERE entry = "default_account"
        `);
        return res[0].values[0][1] as number;
    }

    static setDefaultAccount(account_id: number): void {
        super.sqlite.exec(`
            UPDATE Configuration
            SET value = ${account_id}
            WHERE entry = "default_account"
        `);
    }

}