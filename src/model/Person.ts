import { Model } from "./Model";

export class ModelPerson extends Model {
    readonly id: number;
    name: string;
    debit: number;
    credit: number;
    remission: number;

    private constructor(id: number, name: string, debit: number, credit: number, remission: number) {
        super();
        this.id = id;
        this.name = name;
        this.debit = debit / 100;
        this.credit = credit / 100;
        this.remission = remission / 100;
    }

    static getById(id: number): ModelPerson {
        const res = ModelPerson.sqlite.exec(`
            SELECT * 
            FROM Person 
            WHERE id = ${id}`
        );
        return new ModelPerson(
            res[0].values[0][0] as number,
            res[0].values[0][1] as string,
            res[0].values[0][2] as number,
            res[0].values[0][3] as number,
            res[0].values[0][4] as number
        );
    }

    save(): void {
        ModelPerson.sqlite.exec(`
            UPDATE Person SET 
            name = "${this.name}", 
            debit = ${Math.trunc(this.debit * 100)}, 
            credit = ${Math.trunc(this.credit * 100)}, 
            remission = ${Math.trunc(this.remission * 100)} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelPerson.sqlite.exec(`
            DELETE FROM Person 
            WHERE id = ${this.id}`
        );
    }

}