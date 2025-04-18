import { Model } from "./Model";

export class ModelPerson extends Model {
    readonly id: number;
    name: string;
    /** 
     * **Positive**: Indicates that the user owes money to this person
     * 
     * **Negative**: Indicates that this person owes money to the user
     */
    balance: number;
    /** Amount gave by the user to this person that is forgiven */
    remission: number;
    last_usage: number;

    private constructor(id: number, name: string, balance: number, remission: number, last_usage: number) {
        super();
        this.id = id;
        this.name = name;
        this.balance = balance / 100;
        this.remission = remission / 100;
        this.last_usage = last_usage;
    }

    static create(name: string, balance: number = 0, remission: number = 0): ModelPerson {
        const res = ModelPerson.sqlite.exec(`
            INSERT INTO Person (name, balance, remission, last_usage) 
            VALUES ("${name}", ${Math.trunc(balance * 100)}, ${Math.trunc(remission * 100)}, ${Date.now()}) 
            RETURNING id;
        `);
        return ModelPerson.getById(res[0].values[0][0] as number);
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
            res[0].values[0][4] as number,
        );
    }

    static getList(): ModelPerson[] {
        const res = ModelPerson.sqlite.exec(`
            SELECT * 
            FROM Person
            ORDER BY name ASC
        `);
        const people: ModelPerson[] = [];
        if (res[0])
            for (const person of res[0].values)
                people.push(new ModelPerson(
                    person[0] as number,
                    person[1] as string,
                    person[2] as number,
                    person[3] as number,
                    person[4] as number
                ));
        return people;
    }

    save(): void {
        ModelPerson.sqlite.exec(`
            UPDATE Person SET 
            name = "${this.name}", 
            balance = ${Math.trunc(this.balance * 100)},  
            remission = ${Math.trunc(this.remission * 100)},
            last_usage = ${this.last_usage} 
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