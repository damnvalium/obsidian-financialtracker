import { createTextModal } from "src/module/ModalText";

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