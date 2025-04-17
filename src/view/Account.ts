import { ModelAccount } from "src/model/Account";
import { Action, ControllerUiState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";

export async function viewAccount(placeholder: {
    account: ModelAccount,
    default_account: number
}): Promise<ControllerUiState> {
    return new Promise((resolve) => {
        createSelectionModal(
            `${placeholder.default_account == placeholder.account.id ? "⭐" : "💳"} ${placeholder.account.name}`,
            [
                {
                    text: `◼️ Liquidity: ${placeholder.account.balance.toFixed(2)}`,
                    value: {
                        action: Action.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                {
                    // TODO: Add net worth calculation
                    text: `◼️ Net Worth: N/A`,
                    value: {
                        action: Action.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                {
                    text: ` `,
                    value: {
                        action: Action.OPEN_ACCOUNT,
                        action_data: placeholder.account.id
                    }
                },
                ...Array<SelectionModalData>(
                    {
                        text: `⭐ Set as default`,
                        value: {
                            action: Action.EDIT_ACCOUNT_DEFAULT,
                            action_data: placeholder.account.id
                        },
                    },
                    {
                        text: `🗑️ Delete`,
                        value: {
                            action: Action.DELETE_ACCOUNT,
                            action_data: placeholder.account.id
                        },
                    },
                    {
                        text: ` `,
                        value: {
                            action: Action.OPEN_ACCOUNT,
                            action_data: placeholder.account.id
                        },
                    }
                ).filter(() => placeholder.default_account != placeholder.account.id),
                {
                    text: `🔙 Back`,
                    value: {
                        action: Action.OPEN_ACCOUNTS
                    }
                },
            ],
            (item) => resolve(item),
            () => resolve({ action: Action.CLOSE })
        );
    });
}