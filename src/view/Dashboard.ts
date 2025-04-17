import { ModelAccount } from "src/model/Account";
import { ControllerUiState, Action } from "src/module/ControllerUiState";
import { createSelectionModal } from "src/module/ModalSelection";

export async function viewDashboard(placeholder: {
    default_account: ModelAccount,
    transactions_total: number
}): Promise<ControllerUiState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `💎 Financial Tracker`,
            [
                {
                    text: `💳 ${placeholder.default_account.name}: ${placeholder.default_account.balance}€`,
                    value: {
                        action: Action.OPEN_ACCOUNTS,
                    },
                },
                {
                    text: `🧾 Transactions: ${placeholder.transactions_total >= 0 ?
                        `+${placeholder.transactions_total}` :
                        `-${placeholder.transactions_total}`}€`,
                    value: {
                        action: Action.OPEN_TRANSACTIONS,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: Action.OPEN_DASHBOARD,
                    }
                },
                {
                    text: `🛒 New Expense`,
                    value: {
                        action: Action.CREATE_TRANSACTION,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: Action.OPEN_DASHBOARD,
                    },
                },
                {
                    text: `👥 People`,
                    value: {
                        action: Action.OPEN_PEOPLE,
                    },
                },
                {
                    text: `🔖 Consumers`,
                    value: {
                        action: Action.OPEN_CONSUMERS,
                    }
                },
            ],
            (item) => resolve(item),
            () => resolve({ action: Action.CLOSE }),
        );
    });
}