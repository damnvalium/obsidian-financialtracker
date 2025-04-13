import { ModelAccount } from "src/model/Account";
import { createSelectionModal } from "src/module/SelectionModal";

export async function viewAccounts(_: {accounts: ModelAccount[], default_account: number}) {
    return await createSelectionModal(`💳 Accounts`, [
        ..._.accounts.map((account) => Object({
            text: `${account.id != _.default_account ? "💳" : "⭐"} ${account.name}: ${account.balance.toFixed(2)}€`,
            value: `account:${account.id}`,
        })),
        {
            text: `➕ New account`,
            value: `new_account:accounts`,
        },
        {
            text: ` `,
            value: `accounts`,
        },
        {
            text: `🔙 Back`,
            value: `dashboard`,
        },
    ]);
}