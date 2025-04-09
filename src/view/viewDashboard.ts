import { createSelectionModal } from "src/module/SelectionModal";

export async function viewDashboard(_: {account_balance: number, transactions_total: number}) {
    return createSelectionModal(`💎 Financial Tracker`, [
        {
            text: `💳 Account: ${_.account_balance.toFixed(2)}€`,
            value: `accounts`,
        },
        {
            text: `🧾 Transactions: ${_.transactions_total >= 0 ? `+${_.transactions_total.toFixed(2)}` : `-${_.transactions_total.toFixed(2)}`}€`,
            value: `transactions`,
        },
        {
            text: ` `,
            value: `dashboard`,
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
            value: `dashboard`,
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