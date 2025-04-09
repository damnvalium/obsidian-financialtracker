import { ModelAccount } from "src/model/Account";
import { createModal } from "src/module/Modal";

export async function viewAccounts(accounts: ModelAccount[], default_account: number) {
    const account_entries: {text: string, value: any}[] = accounts.map((account) => Object({
        text: `${account.id != default_account ? "💳" : "⭐"} ${account.name}: ${account.balance.toFixed(2)}€`,
        value: `account:${account.id}`,
    }));
    return await createModal(`💳 Accounts`, [
        ...account_entries,
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