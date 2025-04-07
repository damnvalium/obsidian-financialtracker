import { createModal } from "src/module/Modal";

export async function viewAccounts(accounts: {account: string, }) {
    return await createModal(`💳 Accounts`, [
        {
            text: `+ New Account`,
            value: `new_account`,
        },
        {
            text: `- Remove Account`,
            value: `remove_account`,
        },
        {
            text: ` `,
            value: ` `,
        },
        {
            text: `🔙 Back`,
            value: `dashboard`,
        },
    ]);
}