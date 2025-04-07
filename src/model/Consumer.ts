import { Model } from "./Model";

export class ModelConsumer extends Model {
    readonly id: number;
    parent : ModelConsumer | null;
    name: string;
    last_usage: number;

    private constructor(id: number, parent: ModelConsumer | null, name: string, last_usage: number) {
        super();
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.last_usage = last_usage;
    }

    static getById(id: number): ModelConsumer {
        const res = ModelConsumer.sqlite.exec(`
            SELECT * 
            FROM Consumer 
            WHERE id = ${id}`
        );
        return new ModelConsumer(
            res[0].values[0][0] as number,
            res[0].values[0][1] != null ? ModelConsumer.getById(res[0].values[0][1] as number) : null,
            res[0].values[0][2] as string,
            res[0].values[0][3] as number
        );
    }

    save(): void {
        ModelConsumer.sqlite.exec(`
            UPDATE Consumer SET 
            name = "${this.name}",
            parent_id = ${this.parent != null ? this.parent.id : "null"},
            last_usage = ${this.last_usage} 
            WHERE id = ${this.id}`
        );
    }

    delete(): void {
        ModelConsumer.sqlite.exec(`
            DELETE FROM Consumer 
            WHERE id = ${this.id}`
        );
    }
}