import { createTextModal } from "src/module/TextModal";

export async function viewNewAccount() {
    return await createTextModal(`💳 New Account`, [
        {
            id: `name`,
            name: `Name`
        },
        {
            id: `balance`,
            name: `Starting Balance`,
        }
    ]);
}