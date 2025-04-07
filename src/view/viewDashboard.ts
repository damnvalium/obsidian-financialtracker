import { createModal } from "src/module/Modal";

export async function viewDashboard(account_balance: number, transactions_total: number) {
    return await createModal(`💎 Financial Tracker`, [
        {
            text: `💳 Account: ${account_balance}`,
            value: `accounts`,
        },
        {
            text: `🧾 Transactions: ${transactions_total == 0 ? '0' : transactions_total.toFixed(2)}€`,
            value: `transactions`,
        },
        {
            text: ` `,
            value: ` `,
        },
        {
            text: `🛒 New Expense`,
            value: `new_expense`,
        },
        {
            text: `🌫️ New Flow`,
            value: `flow`,
        },
        {
            text: ` `,
            value: ` `,
        },
        {
            text: `👥 People`,
            value: `people`,
        },
        {
            text: `🔖 Consumers`,
            value: `consumers`,
        },
    ]);
}