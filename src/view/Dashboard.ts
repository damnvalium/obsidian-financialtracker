import { ModelAccount } from "src/model/Account";
import { ControllerState, ControllerAction } from "src/module/ControllerUiState";
import { createSelectionModal } from "src/module/ModalSelection";

export async function viewDashboard(placeholder: {
    default_account: ModelAccount,
    transactions_total: number
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `💎 Financial Tracker`,
            [
                {
                    text: `💳 ${placeholder.default_account.name}: ${placeholder.default_account.balance}€`,
                    value: {
                        action: ControllerAction.OPEN_ACCOUNTS,
                    },
                },
                {
                    text: `🧾 Transactions: ${placeholder.transactions_total >= 0 ?
                        `+${placeholder.transactions_total}` :
                        `-${placeholder.transactions_total}`}€`,
                    value: {
                        action: ControllerAction.OPEN_TRANSACTIONS,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_DASHBOARD,
                    }
                },
                {
                    text: `🛒 New Expense`,
                    value: {
                        action: ControllerAction.CREATE_TRANSACTION,
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.OPEN_DASHBOARD,
                    },
                },
                {
                    text: `👥 People`,
                    value: {
                        action: ControllerAction.OPEN_PEOPLE,
                    },
                },
                {
                    text: `🔖 Consumers`,
                    value: {
                        action: ControllerAction.OPEN_CONSUMERS,
                    }
                },
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE }),
        );
    });
}